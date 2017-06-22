import { User } from '../../src/models/User';

describe('User', () => {
    let user;

    beforeEach(() => {
        user = new User();
    });

    it("isSeller should return true if user has ROLE_SELLER role", () => {
        user.set("roles", [User.ROLE_SELLER]);

        console.info(user.get("roles"));

        expect(user.isSeller()).toBe(true);
    });

});
