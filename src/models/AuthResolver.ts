import {Query, Resolver} from "type-graphql";

@Resolver()
export class AuthResolver {

    @Query(type => Boolean)
    async ValidateToken() {

        return true;
    }
}
