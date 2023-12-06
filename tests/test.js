const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app'); // Import your app

describe('Page Status', () => {
    it('should return 200 for the home page', (done) => {
        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should return 200 for the register page', (done) => {
        request(app)
            .get('/register')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should return 200 for the login page', (done) => {
        request(app)
            .get('/login')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
});