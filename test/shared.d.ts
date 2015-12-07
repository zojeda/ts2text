declare namespace shared {
	namespace model {
		export interface IUser {
			id: string,
			username: string
		}		
	}
	namespace service {
			
		export interface IUserService {
			list(done : (error: Error, users: shared.model.IUser[]) => void ) : void;
		}		
	}
}

