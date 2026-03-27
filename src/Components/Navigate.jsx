import React from 'react'
import { Col, Row } from 'react-bootstrap'
import './Navigate.css'

function Navigate() {
    return (
        <div>
            <Row className='w-100 pt-3 shadow pb-2'>
                <Col >
                    <div id='Nav-logo' style={{gap:"30px"}} className='d-flex justify-content-center align-items-center'>
                        <img width={'55px'} src="https://search.brave.com/images?q=logo+for+swiggy&context=W3sic3JjIjoiaHR0cHM6Ly9zdGF0aWMudmVjdGVlenkuY29tL3N5c3RlbS9yZXNvdXJjZXMvdGh1bWJuYWlscy8wNzUvMTk1LzM5NC9zbWFsbC9zd2lnZ3ktbG9nby1yb3VuZGVkLXNxdWFyZS1nbG9zc3ktaWNvbi13aXRoLXRyYW5zcGFyZW50LWJhY2tncm91bmQtZnJlZS1wbmcucG5nIiwidGV4dCI6IlN3aWdneSBMb2dvIC0gUm91bmRlZCBTcXVhcmUgR2xvc3N5IEljb24gd2l0aCBUcmFuc3BhcmVudCBCYWNrZ3JvdW5kIHBuZyIsInBhZ2VfdXJsIjoiaHR0cHM6Ly93d3cudmVjdGVlenkuY29tL2ZyZWUtcG5nL3N3aWdneSJ9XQ%3D%3D&sig=8cd1fe2d960aff57bb7f0b609fa8b458952595c5f3b9e2c1856095d26b35839b&nonce=bce99475b4bbfefc60c996500d8d6135&source=imageCluster" alt="lolll" />
                        <p style={{fontSize:"13px"}} className='mt-3'><span className='fw-bold text-decoration-underline'>Kakkanad</span> 288R+8PX, Echamuku, Kakkanad...</p>
                        <i style={{color:"#e78838"}} className="fa-solid fa-angle-down"></i>
                        </div>
                </Col>
                <Col>
                        <div id='Nav-icons' className='d-flex justify-content-between align-items-center w-75 mt-3'>
                            <p><i className="fa-solid fa-magnifying-glass"> </i> Search</p>
                            <p><i className="fa-solid fa-percent"></i> Offers <sup style={{color:"#fda502"}}>New</sup> </p>
                            <p><i className="fa-solid fa-bowl-food"></i> Help</p>
                            <p><i className="fa-regular fa-user"></i> Profile</p>
                            <p><i className="fa-solid fa-cart-shopping"></i> Cart</p>
                        </div>
                </Col>
            </Row>
        </div>
    )
}

export default Navigate