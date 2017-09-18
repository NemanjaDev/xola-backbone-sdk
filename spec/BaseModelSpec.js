import { BaseModel } from '../src/BaseModel';

describe('BaseModel', () => {
    let baseModel;

    beforeEach(() => {
        baseModel = new BaseModel();
    });

    describe("initialize()", () => {
        it('should default to null parent', () => {
            expect(baseModel.parent).toBeNull();
        });

        it('should set given parent', () => {
            const parentModel = new BaseModel();
            baseModel = new BaseModel({ parent: parentModel });
            expect(baseModel.parent).toBe(parentModel);
        });
    });

    describe("url()", () => {
        it("should return urlRoot when parent is not set", () => {
            baseModel.urlRoot = '/foo';

            expect(baseModel.url()).toBe('/foo');
        });

        it("should return nested url when parent is set", () => {
            const parentModel = new BaseModel();
            parentModel.urlRoot = '/bar';

            baseModel.parent = parentModel;
            baseModel.urlRoot = '/foo';

            expect(baseModel.url()).toBe('/bar/foo');
        });

        it("should override parent's urlRoot", () => {
            const parentModel = new BaseModel({ id: 123 });
            parentModel.urlRoot = '/bar';

            baseModel.set("id", 456);
            baseModel.parent = parentModel;
            baseModel.urlRoot = '/foo';
            baseModel.parentUrlRoot = '/baz';

            expect(baseModel.url()).toBe('/baz/123/foo/456');
        });
    });
});
