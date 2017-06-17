import { BaseModel } from '../src/BaseModel';

describe('BaseModel', () => {
    let baseModel;

    beforeEach(() => {
        baseModel = new BaseModel();
    });

    it('should default to null parent when created', () => {
        expect(baseModel.parent).toBeNull();
    });

    it('should set given parent when created', () => {
        const parentModel = new BaseModel();
        baseModel = new BaseModel({ parent: parentModel });
        expect(baseModel.parent).toBe(parentModel);
    });

    it('should return correct url when parent is not set', () => {
        baseModel.urlRoot = '/foo';
        expect(baseModel.url()).toBe('/foo');
    });

    it('should return correct url when parent is set', () => {
        const parentModel = new BaseModel();
        parentModel.urlRoot = '/bar';
        baseModel = new BaseModel({ parent: parentModel });
        baseModel.urlRoot = '/foo';
        expect(baseModel.url()).toBe('/bar/foo');
    });

    it("should override parent's urlRoot", () => {
        const parentModel = new BaseModel({ id: 123 });
        parentModel.urlRoot = '/bar';

        baseModel = new BaseModel({ id: 456, parent: parentModel });
        baseModel.urlRoot = '/foo';
        baseModel.parentUrlRoot = '/baz';

        expect(baseModel.url()).toBe('/baz/123/foo/456');
    });

    it("wshould parse nested model", () => {

    });
});
