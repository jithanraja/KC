var express = require("express");
var router = express.Router();

/***
   * @swagger
   * definitions:
   *   Location:
   *     type: object
   *     required:
   *        - coordinates
   *     properties:
   *        coordinates:
   *           type: array
   *           example: [10, 10]
   *           items:
   *              type: number
   *   Address:
   *     type: object
   *     required:
   *        - doorNo
   *        - street
   *        - locality
   *        - area
   *        - state
   *        - district
   *        - pincode
   *        - location
   *     properties:
   *        doorNo:
   *           type: string
   *           example: 10
   *        street:
   *           type: string
   *           example: 2nd street
   *        locality:
   *           type: string
   *           example: Gindi
   *        area:
   *           type: string
   *           example: Gindi
   *        state:
   *           type: string
   *           example: Tamil Nadu
   *        district:
   *           type: string
   *           example: chennai
   *        pincode:
   *           type: number
   *           example: 600001
   *        location:
   *           $ref: '#/definitions/Location'
   *   Store:
   *     type: object
   *     required:
   *        - storeName
   *        - representative
   *        - contactNo
   *        - emailId
   *        - password
   *        - address
   *        - altContactNo
   *     properties:
   *        storeName:
   *           type: string
   *           example: store1
   *        representative:
   *           type: string
   *           example: John
   *        contactNo:
   *           type: number
   *           example: 9047490998
   *        emailId:
   *           type: string
   *           example: abc@gmail.com
   *        password:
   *           type: string
   *        altContactNo:
   *           type: number
   *           example: 9047490998
   *        address:
   *           $ref: '#/definitions/Address'
   *   Product:
   *     type: object
   *     required:
   *        - productName
   *        - categoryId
   *        - buyingPrice
   *        - displayPrice
   *        - maxDiscount
   *        - unitType
   *        - slabs
   *     properties:
   *        productName:
   *          type: string
   *          example: Onion
   *        productImage:
   *          type: string
   *          example: https://dummy/temp.jpg
   *        categoryId:
   *          type: string
   *          example: 61cdce6dcb3fa6817434e1c1
   *        buyingPrice:
   *          type: number
   *          example: 20.00
   *        displayPrice:
   *          type: number
   *          example: 18.00
   *        maxDiscount:
   *          type: number
   *          example: 2
   *        unitType:
   *          type: string
   *          enum: ['kg', 'pcs', 'ltrs']
   *          example: kg
   *        slabs:
   *          type: array
   *          items:
   *            $ref: '#/definitions/Slab'
   *   Order:
   *     type: object
   *     required:
   *        - orderStatus
   *        - transactionProperties
   *     properties:
   *        transactionProperties: 
   *           type: string
   *           example: 61cdce6dcb3fa6817434e1c1
   *        orderStatus:
   *           type: string
   *           enum: ['ordered', 'assigned', 'completed', 'declined']
   *           example: abc
   *        properties:
   *           $ref: '#/definitions/OrderProperties'
   *        deliveryDetails:
   *           $ref: '#/definitions/DeliveryDetails'
   *   DeliveryDetails:
   *     type: object
   *     required:
   *        - storeAddress
   *        - deliveryAddress
   *     properties:
   *        storeAddress:
   *           type: string
   *           example: abcs
   *        deliveryAddress:
   *           type: string
   *           example: abcs
   *   OrderProperties:
   *     type: object
   *     required:
   *        - totalAmt
   *        - amount
   *     properties:
   *        totalAmt:
   *           type: number
   *           example: 18.00 
   *        amount:
   *           type: number
   *           example: 18.00 
   *        taxInfo:
   *            $ref: '#/definitions/TaxObject'
   *        couponCode:
   *           type: string
   *           example: NEWCPN
   *        amtFromWallet:
   *           type: number
   *           example: 18.00 
   *        items:
   *          type: array
   *          items:
   *            $ref: '#/definitions/OrderItems'
   *   TaxObject:
   *     type: object
   *     required:
   *        - GST
   *        - VAT
   *     properties:
   *        GST:
   *           type: number
   *           example: 18
   *        VAT:
   *           type: number
   *           example: 18 
   *   OrderItems:
   *     type: object
   *     required:
   *        - name
   *        - qty
   *        - price
   *        - productId
   *     properties:
   *        name:
   *           type: string
   *           example: ABC
   *        qty:
   *           type: number
   *           example: 18.00 
   *        unit:
   *           type: string
   *           example: %
   *        price:
   *           type: number
   *           example: 18.00
   *        productId:
   *           type: string
   *           example: abdccd
   *   Slab:
   *     type: object
   *     required:
   *        - from
   *        - to
   *        - unitPrice
   *     properties:
   *        from:
   *           type: number
   *           example: 1
   *        to:
   *           type: number
   *           example: 5
   *        unitPrice:
   *           type: number
   *           example: 14
   *   Coupon:
   *      type: object
   *      required:
   *        - couponName
   *        - couponCode
   *        - couponDiscription
   *      properties:
   *         couponName:
   *            type: string
   *            example: ABC
   *         couponCode:
   *            type: string
   *            example: A1b2C3
   *         couponDescription:
   *            type: string
   *            example: AutoGenerated coupon
   *         status:
   *            type: boolean
   *            default: true
   *         percentage:
   *            type: number
   *            example: 0
   *            min: 0
   *            max: 100
   *         imageURL:
   *            type: string
   *            example: http://domain/path/image.png
   *   Offers:
   *     type: object
   *     required:
   *        - billValue
   *        - coupon
   *     properties:
   *        billValue:
   *           type: number
   *           example: 3
   *        billPercentage:
   *           type: number
   *           example: 25
   */
router.get("/", function (req, res, next) {
  res.redirect("/doc");
});

module.exports = router;