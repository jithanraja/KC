import { ArrowBack, Close, RemoveRedEye } from '@material-ui/icons'
import React from 'react'
import { Col, Row, Card, Button, Modal } from 'react-bootstrap'
import { Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core'
import profile from './../../../assets/images/profile.svg'

function OrderDetails(props) {

    const order = props.order;

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="order-details">
            <Row className="my-3 mx-0 order-details-head">
                <Col sm={12} md={6}>
                    <div className="go-to-back cursor-pointer">
                        <ArrowBack onClick={() => props.setSelectedOrder(null)} />
                    </div>
                    <span className="id-badge text-uppercase">ORDER ID #{order.orderId}</span>
                    <span className="status-badge text-uppercase">{order.status}</span>
                </Col>
                <Col sm={4} md={2} className="text-center">
                    <span className="order-btn items-btn text-uppercase">ITEMS <span>{order?.Items?.length || 0}</span></span>
                </Col>
                <Col sm={4} md={2} className="text-center">
                    <span className="order-btn qty-btn text-uppercase">QTY <span>{order?.quantity || 0}</span></span>
                </Col>
                <Col sm={4} md={2} className="text-center">
                <span className="order-btn total-btn text-uppercase">TOTAL <span>{order?.totalAmt || 0}</span></span>
                </Col>
            </Row>
            <Row className="mx-3 my-5">
                <Col sm={12} md={7}>
                    <div className="primary-title mb-2">Item Details</div>
                    <Card className="mb-4">
                        <Card.Body>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-uppercase">Item Name</TableCell>
                                        <TableCell className="text-uppercase">Qty</TableCell>
                                        <TableCell className="text-uppercase">Price</TableCell>
                                        <TableCell className="text-uppercase">Kgs/pcs</TableCell>
                                        <TableCell className="text-uppercase">Total</TableCell>
                                        <TableCell className="text-uppercase">chain</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="text-uppercase">Onion</TableCell>
                                        <TableCell className="text-uppercase">1</TableCell>
                                        <TableCell className="text-uppercase">20</TableCell>
                                        <TableCell className="text-uppercase">2</TableCell>
                                        <TableCell className="text-uppercase">40</TableCell>
                                        <TableCell className="text-uppercase"><RemoveRedEye className="cursor-pointer" onClick={handleOpen} /> </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Row className="mx-4 my-2">
                                <Col sm={4} className="text-uppercase font-weight-bold d-flex align-items-center">change status</Col>
                                <Col sm={6}>
                                    <div className="form-group">
                                        <label className="text-uppercase form-label">change status</label>
                                        <select className="form-control">
                                            <option value=''>Select Status</option>
                                            <option value='assigned'>Assigned</option>
                                            <option value='declined'>Declined</option>
                                            <option value='completed'>Completed</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={10} align={'right'}>
                                    <Button>UPDATE</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={5} className="font-weight-bold mt-4">
                    <Card className="mb-3 mt-2">
                        <Card.Body>
                            <Row className="mx-0">
                                <Col sm={3} className="text-center">
                                    <img src={profile} width={70} alt="profile" />
                                </Col>
                                <Col sm={9}>
                                    <div className="profile-details-row">
                                        <span>Name</span>
                                        <span>John Smith</span>
                                    </div>
                                    <div className="profile-details-row">
                                        <span>Sub Total</span>
                                        <span>₹ 0</span>
                                    </div>
                                    <div className="profile-details-row">
                                        <span>Wallet Used</span>
                                        <span>₹ 0</span>
                                    </div>
                                    <div className="profile-details-row">
                                        <span>Delivery</span>
                                        <span>0</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="mx-0">
                                <Col sm={4}>Coupon</Col>
                                <Col sm={8} className="value-color" align={'right'}>NIL</Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="mx-0">
                                <Col sm={4}>Total</Col>
                                <Col sm={8} className="value-color" align={'right'}>₹ 0</Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="mx-0">
                                <Col sm={5} className="address-label-color">Store Address</Col>
                                <Col sm={7} className="form-label address-color pb-3" align={'right'}>No 88/12, Selvam Stores, Near to Reliance Mall, Coimbatore - 641031</Col>
                                <Col sm={5} className="address-label-color">Delivery Address</Col>
                                <Col sm={7} className="form-label address-color" align={'right'}>No 66, Lakshmi Nagar, NSN Palayam, Coimbatore - 641031</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal
                show={open}
                onHide={handleClose}
                size="lg"
                aria-labelledby="order-chain-info"
                centered={true}
            >
                <Modal.Body>
                    <div className="model-close">
                        <Close onClick={handleClose} />
                    </div>
                    <Row className="mb-3 mx-0 order-details-head align-items-center">
                        <Col sm={12} md={6}>
                            <span className="id-badge text-uppercase">ORDER ID #{order.orderId}</span>
                            <span className="status-badge text-uppercase">{order.status}</span>
                        </Col>
                        <Col sm={4} md={2} className="text-center">
                            <div className="my-2">Chain</div>
                            <span>{order?.Items?.length || 0}</span>
                        </Col>
                        <Col sm={4} md={2} className="text-center">
                            <div className="my-2">Earning</div>
                            <span className="value-color">₹ {order?.earnings || 0}</span>
                        </Col>
                        <Col sm={4} md={2} className="text-center">
                            <div className="bg-gray">
                                <div className="my-2"><img src={profile} width={30} alt="profile" /></div>
                                <span className="value-color">₹ {order?.Items?.length || 0}</span>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mx-5 mt-5 font-weight-bold">
                        <Col sm={2}></Col>
                        <Col sm={3}>Mates</Col>
                        <Col sm={2}>Qty</Col>
                        <Col sm={2}>Discount</Col>
                    </Row>
                    <Row className="mx-5 py-3 align-items-center border-bottom">
                        <Col sm={2}><img src={profile} width={40} alt="profile" /></Col>
                        <Col sm={3}>Kevin</Col>
                        <Col sm={2}>2</Col>
                        <Col sm={2}>₹ 0.50</Col>
                    </Row>
                    <Row className="mx-5 py-3 align-items-center">
                        <Col sm={2}><img src={profile} width={40} alt="profile" /></Col>
                        <Col sm={3}>Josheph</Col>
                        <Col sm={2}>2</Col>
                        <Col sm={2}>₹ 0.50</Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default OrderDetails
