import {createClient} from 'redis'
import {promisify} from 'util'
/* creating a class that can interact with redis */

class RedisClient {
	constructor() {
		this.client = createClient();
		this.client.on('error', (error) => {console.log(error)});
		this.getValue = promisify(this.client.get).bind(this.client);
		this.setValue = promisify(this.client.set).bind(this.client);
		this.delKey = promisify(this.client.del).bind(this.client);
		this.client.connected = true;
	}
	isAlive() {
		if(this.client.connected) {
			return true
		}
		return false;
	}
	async get(key) {
		return this.getValue(key);
	}
	async set(key, value, duration) {
		return this.setValue(key, value, 'EX', duration);
	}
	async del(key) {
		return this.delKey(key)
	}

}
const redisClient = new RedisClient();
export default redisClient;
