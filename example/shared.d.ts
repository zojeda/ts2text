declare namespace shared {
	namespace model {
		interface IUser {
			id: string,
			username: string
		}		
	}
	namespace service {
		interface BaseInterface {
			doSomething(done : (error: Error, result: string) => void ) : void;
		}		
			
		interface IUserService extends BaseInterface {
			list(done : (error: Error, users: model.IUser[]) => void ) : void;
		}		
	}
}

