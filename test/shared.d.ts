declare namespace shared {
	namespace model {
		export interface IUser {
			id: string,
			username: string
		}		
	}
	namespace service {
		export interface ServiceResponeCallback<T> {( error?: Error, response?: T ) : void}
			
		export interface IUserService {
			list(done : ServiceResponeCallback<model.IUser> ) : void;
		}		
	}
}

