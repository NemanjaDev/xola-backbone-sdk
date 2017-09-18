import { User } from '../../src/models/User';

describe('User', () => {
    let user;

    const ROLE_1 = "ROLE_1";
    const ROLE_2 = "ROLE_2";
    const ROLE_3 = "ROLE_3";

    const ROLE_X = "ROLE_X";

    beforeEach(() => {
        user = new User();

        user.set("roles", [ROLE_1, ROLE_2, ROLE_3]);
    });

    describe("hasRole()", () => {
        it("should return `false` if user does not have given role", () => {
            expect(user.hasRole(ROLE_X)).toBe(false);
        });

        it("should return `true` if user has given role", () => {
            expect(user.hasRole(ROLE_1)).toBe(true);
            expect(user.hasRole(ROLE_2)).toBe(true);
            expect(user.hasRole(ROLE_3)).toBe(true);
        });
    });

    describe("isSeller()", () => {
        it("should return `false` if user does not have 'ROLE_SELLER' role", () => {
            expect(user.isSeller()).toBe(false);
        });

        it("should return `true` if user has 'ROLE_SELLER' role", () => {
            user.set("roles", [User.ROLE_SELLER]);

            expect(user.isSeller()).toBe(true);
        });
    });

    describe("isAdmin()", () => {
        it("should return `false` if user does not have 'ROLE_ADMIN' nor 'ROLE_SUPER_ADMIN' role", () => {
            expect(user.isSeller()).toBe(false);
        });

        it("should return `true` if user has either 'ROLE_ADMIN' or 'ROLE_SUPER_ADMIN' role", () => {
            user.set("roles", [User.ROLE_ADMIN]);

            expect(user.isAdmin()).toBe(true);

            user.set("roles", [User.ROLE_SUPER_ADMIN]);

            expect(user.isAdmin()).toBe(true);
        });
    });

    describe("isReservationist()", () => {
        it("should return `false` if user does not have 'ROLE_RESERVATION' nor 'ROLE_RESERVATION_LITE' role", () => {
            expect(user.isReservationist()).toBe(false);
        });

        it("should return `true` if user has either 'ROLE_RESERVATION' or 'ROLE_RESERVATION_LITE' role", () => {
            user.set("roles", [User.ROLE_RESERVATION]);

            expect(user.isReservationist()).toBe(true);

            user.set("roles", [User.ROLE_RESERVATION_LITE]);

            expect(user.isReservationist()).toBe(true);
        });
    });

    describe("isGuideManager()", () => {
        it("should return `false` if user does not have 'ROLE_GUIDE_MANAGER' role", () => {
            expect(user.isGuideManager()).toBe(false);
        });

        it("should return `true` if user has 'ROLE_GUIDE_MANAGER' role", () => {
            user.set("roles", [User.ROLE_GUIDE_MANAGER]);

            expect(user.isGuideManager()).toBe(true);
        });
    });
});
