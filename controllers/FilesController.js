import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs'

const FilesController = {
  async postUpload (req, res)  {
    const token = req.headers['x-token'] || req.headers['X-Token'];
    if (! token) {
      return res.status(401).json({ "error" : "Unauthorized" });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const user = await dbClient.getUser({"_id": new ObjectId(userId)});
    if (! user) {
      return res.status(401).json({ "error": "Unauthorized" });
    }
    const payload = req.body;
    const acceptedTypes = ['folder', 'file', 'image'];
    const {name, type, data, parentId = '0', isPublic = false } = payload;
    const collection =  await dbClient.db.collection('files');
    let correctType;
    if (acceptedTypes.includes(type)) {
      correctType = true;
    }
    else {
      correctType = false;
    }
    if (! name) {
      return res.status(400).json({ "error": "Missing name"});
    }
    if (! type || correctType === false) {
      return res.status(400).json({ "error": "Missing type"});
    }
    if (! data && type != 'folder') { 
      return res.status(400).json({ "error": "Missing data" })
    };
    if (parentId !== '0') {
      const parentFolder = collection.findOne({ _id: new ObjectId(parentId) });
      if (! parentFolder) {
        return res.status(400).json({ "error": "Parent not found" });
      }
      if (parentFolder.type !== 'folder') {
        return res.status(400).json({ "error": "Parent is not a folder" });
      }
    }
   const newFile = {
     name: name,
     type: type,
     data: data,
     parentId: parentId,
     isPublic: isPublic,
     userId: user._id
   }
  if (newFile.type === 'folder') {
    await collection.insertOne(newFile);
    return res.status(201).json(newFile);
  }
  const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
  const path = uuidv4();
  const fullPath = `${folderPath}/${path}`;
  if (! fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  const fileData = Buffer.from(newFile.data, 'base64');
  fs.writeFile(fullPath, fileData, (error) => {
    if (error) {
      console.log('an error occured while attempting to write data to a file', error);
    }
  })
  if (newFile.typ != 'folder') {
    newFile.localPath = fullPath
    await collection.insertOne(newFile);
    res.status(201);
  }
    }
};
module.exports = FilesController;
