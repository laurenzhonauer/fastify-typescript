import fastify from "fastify";
import fastifySwagger from "fastify-swagger";
import fastifyHelmet from "fastify-helmet";

const app = fastify({ logger: true });

const registerCSP = (instance) => {
    console.log("swaggercSP is: ", instance.swaggerCSP);

  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        scriptSrc: ["'self'"].concat(instance.swaggerCSP.script),
        styleSrc: ["'self'", "https:"].concat(instance.swaggerCSP.style),
      },
    },
  };
};

app.register(fastifySwagger, {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Fastify API',
            description: 'Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger',
            version: '1.0.0'
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        host: 'localhost',
        schemes: ['http'],
    }
});

// should work but doesnt
// app.register(fastifyHelmet, registerCSP);

// works
app.register(require("fastify-helmet"), registerCSP);

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

try {
  app.listen(8080);
} catch (err) {
  app.log.error({ err }, "what an error");
  process.exit(1);
}
