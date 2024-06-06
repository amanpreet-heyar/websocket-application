const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SK);

const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/v1/invoices", async (req, res) => {
  const invoice = await stripe.invoices.create({
    customer: "cus_Pzr6LSlfkUA8MY",
    currency: "inr",
    due_date: 1718967086,
   
    collection_method: "send_invoice",
  });

  await stripe.invoiceItems.create({
    customer: "cus_Pzr6LSlfkUA8MY",
    amount: 36785,
    currency: "inr",
    description: "first payment",
    invoice: invoice.id,
  });

  await stripe.invoiceItems.create({
    customer: "cus_Pzr6LSlfkUA8MY",
    amount: -800,
    currency: "inr",
    description: "callout fees",
    invoice: invoice.id,
  });
  console.log(invoice.id, "id=====>");

  //   await stripe.invoice.finalizeInvoices(invoice.id);

  res.send({
    invoice,
  });
});

app.get("/api/v1/invoices/:id", async (req, res) => {
  const invoiceId = req.params.id;

  const item = await stripe.invoices.update(invoiceId, {
  
    metadata: {
      order_id: 34567,
    },
  });

  res.send(item);
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});
