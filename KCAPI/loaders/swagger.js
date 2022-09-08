var app = require("../app");

module.exports = () => {
  var config = require("../config");
  const swaggerJSDoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");

  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Konnect Kart",
        description: "API for Konnect Cart e-commerce grocery application.",
        contact: {
          name: "KonnectCart",
        },
        servers: [config.API_BASE_URL],
      },
      basePath: "/",
      tags: [
        {
          name: "Common",
          description: "Common APIs like file upload, generate test token for dev",
          url: "/common"
        },
        {
          name: "Collections",
          description: "Collections APIs",
          url: "/collections"
        },
        {
          name: "Admin",
          description: "Admin users API",
          url: "/admin"
        },
        {
          name: "Users",
          description: "Users Web API for all the need",
          url: "/users"
        },
        {
          name: "FriendsList",
          description: "Friends List Web API for all the need",
          url: "/friends"
        },
        {
          name: "Lists",
          description: "Lists Web API for all the need",
          url: "/lists"
        },
        {
          name: "Categories",
          description: "Categories APIs",
          url: "/categories"
        },
        {
          name: "Stores",
          description: "Stores APIs",
          url: "/stores"
        },
        {
          name: "Products",
          description: "Products Web APIs",
          url: "/products"
        },
        {
          name: "Coupons",
          description: "Coupons APIs",
          url: "/coupons"
        },
        {
          name: "Community",
          description: "Community APIs",
          url: "/community"
        }
      ],
    },
    apis: ["app.js", "api/routes/*"],
  };

  const swaggerDocument = swaggerJSDoc(swaggerOptions);

  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.markdown {font-size: 12px;}.markdown p {margin: 0 !important;}'
  }, {
    docExpansion: 'none'
  }));
};
