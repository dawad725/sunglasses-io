const chai = require("chai");
const server = require('../app/server')
const chaiHTTP = require("chai-http");
let loggedInUser = require('../app/server')

const assert = chai.assert;
const { expect } = require('chai');
const should = chai.should();


chai.use(chaiHTTP);






//Get Brands 
describe('/GET brands', () => {
    it.only('it should GET all the brands', done => {
        chai
            .request(server)
            .get('/api/brands')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.not.be.null;
                res.body.should.be.an('array');
                res.body.length.should.be.eql(5);
                done();
            });
    });

});
//Get Products 
describe('/GET products', () => {
    it.only('should GET all the products', done => {
        chai
            .request(server)
            .get('/api/products')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(11);
                done();
            });
    });

    it.only('should GET products based on query search', done => {
        chai
            .request(server)
            .get('/api/products?query=best')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(4);
                done();
            });
    });
    it.only('should GET an error message if no query is entered in search field', done => {
        chai
            .request(server)
            .get('/api/products?query=' + '')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('should GET error if there are no products that match the query', done => {
        chai
            .request(server)
            .get('/api/products?query=gucci')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('fails as expected when unrecognized property', done => {
        chai
            .request(server)
            .get('/api/products?query=sdfv')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('should be able to search in uppercase or lowercase letters', done => {
        chai
            .request(server)
            .get('/api/products?query=GLASSES')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
    });
});

// Get Products by brand 
describe('/GET products by brand id ', () => {
    it.only('should GET all products for a particular brand', done => {
        chai
            .request(server)
            .get('/api/brands/1/products')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
    });

    it.only('it should give an error if it is given an id for which there is no brand', done => {
        chai
            .request(server)
            .get('/api/brands/9/products')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('string');
                done();
            });
    });


});

// Post Login 
describe('/Post Login ', () => {
    it.only('should take in the users credentials to verify who they are ', done => {

        let user = {
            username: 'yellowleopard753',
            password: 'jonjon'
        };

        chai
            .request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('should return an error if there is nothing in username or password fields ', done => {

        let user = {
            username: '',
            password: ''
        };

        chai
            .request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('string');
                done();
            });

    });

    it.only('should return error if password is wrong', done => {

        let user = {
            username: 'yellowleopard753',
            password: 'jonjon456'
        };

        chai
            .request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('should return error if username is wrong', done => {

        let user = {
            username: 'yellowleopard999',
            password: 'jonjon'
        };

        chai
            .request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('string');
                done();
            });
    });


});



//Add to cart Post
describe('/Post add to cart button ', () => {

    it.only('should check for access token of user', done => {
        chai
            .request(server)
            .post('/api/me/cart?token=87987')
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it.only('if the access token does not match assigned token return error ', done => {

        chai
            .request(server)
            .post('/api/me/cart?token=879d7')
            .send()
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('string');
                done();
            });
    });

    it.only('adding a product to the users cart should update the cart', done => {

        let product = {
            "id": "1",
            "categoryId": "1",
            "name": "Superglasses",
            "description": "The best glasses in the world",
            "price": 150,
            "imageUrls": ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg", "https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg", "https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        }

        chai
            .request(server)
            .post('/api/me/cart?token=87987')
            .send(product)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array')
                done();
            });
    });

    it.only('if product is already in the cart it should update the quantity', done => {

        let product = {
            "id": "3",
            "categoryId": "1",
            "name": "Brown Sunglasses",
            "description": "The best glasses in the world",
            "price": 50,
            "imageUrls": ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg", "https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg", "https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        }

        chai
            .request(server)
            .post('/api/me/cart?token=87987')
            .send(product)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array')
                done();
            });
    });

});

//Cart GET route 
describe('/Delete shopping cart ', () => {

    it.only('clear the entire shopping cart ', done => {

        chai
            .request(server)
            .delete('/api/me/cart?token=87987')
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.equal(0)
                done();
            });

    });

});


    //Cart GET route 
    describe('/GET shopping cart ', () => {

        it.only('should check for access token of user', done => {
            chai
                .request(server)
                .get('/api/me/cart?token=87987')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it.only('should return shopping cart to the user', done => {
            chai
                .request(server)
                .get('/api/me/cart?token=87987')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it.only('should return error if user is not logged in', done => {
            chai
                .request(server)
                .get('/api/me/cart')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an('string');
                    done();
                });
        });

    });


describe('/DELETE shopping cart', () => {
    it.only('should remove an item from the shopping cart', done => {

        chai
            .request(server)
            .delete('/api/me/cart/1?token=87987')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });

    });
    it.only('should not be able to remove item if token is invalid', done => {

        chai
            .request(server)
            .delete('/api/me/cart/1?token=8787')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.an('string');
                done();
            });

    });

    it.only('should not be able to remove item if token is not present', done => {

        chai
            .request(server)
            .delete('/api/me/cart/1?token=')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.an('string');
                done();
            });

    });




});

describe('/POST update shopping cart ', () => {
    it.only('should allow user to change the quantity of item', done => {

        chai
            .request(server)
            .post('/api/me/cart/1?token=87987')
            .send({ quantity: 5 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array')
                done();
            });

    });

    it.only('should give an error if the product doesnt exist in cart', done => {

        chai
            .request(server)
            .post('/api/me/cart/0?token=87987')
            .send({ quantity: 2 })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('string');
                done();
            });

    });
});

