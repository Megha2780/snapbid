const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
const razorpay = new Razorpay({
  key_id: "rzp_test_zsGgjdiHn7SOm3",
  key_secret: "RilwXL8uackbMI9MW7KaiXeT",
});

const db = mysql.createConnection({
  database: "main",
  host: "localhost",
  user: "root",
  password: "",
});
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
const secretKey = generateSecretKey();
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected");
  }
});
app.post("/create-payment", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // amount in smallest currency unit (e.g., paisa)
      currency: "INR",
      payment_capture: 1, // auto-capture
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
    console.log(order);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

// Route to handle UPI payment callback
app.post("/upi-payment-callback", (req, res) => {
  const { payment_id, order_id, vpa, status } = req.body;
  // Process the UPI payment callback here
  console.log("UPI Payment Callback:", { payment_id, order_id, vpa, status });
  // Update your database or take necessary actions based on the payment status
  res.json({ message: "UPI payment callback received" });
});
app.post("/api/inspay", (req, res) => {
  const { userid, orderid, paymentDt, paymentAmount } = req.body;
  const sql =
    "INSERT INTO tblpayment (userid, orderid, paymentDt, paymentAmount) VALUES (?, ?, ?, ?)";
  const values = [userid, orderid, paymentDt, paymentAmount];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error inserting payment data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Payment data inserted successfully:", results);
    res.json({
      message: "Data Inserted Successfully",
    });
  });
});
app.put("/api/downloadcount/:imgid", (req, res) => {
  const { imgid } = req.params;
  const sql =
    "UPDATE tblimage SET totaldownloads = totaldownloads + 1 WHERE imgid = ?";
  db.query(sql, imgid, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      // Fetch the updated totalviews for the specific image
      db.query(
        "SELECT totalviews FROM tblimage WHERE imgid = ?",
        imgid,
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Send the updated totalviews as response
            res.json({ totalviews: results[0].totalviews });
          }
        }
      );
    }
  });
});
app.put("/api/owner", (req, res) => {
  const { imgid, userid } = req.body;
  const sql =
    "UPDATE tblimage SET userid = ? , inAuction = 'false' WHERE imgid = ?";
  const values = [userid, imgid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.json(results);
    }
  });
});
app.get("/download-image", async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl; // URL of the image in Firebase Storage
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const imageBuffer = await response.buffer();
    res.set("Content-Type", response.headers.get("Content-Type"));
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

app.get("/api/auctionDisplay", (req, res) => {
  sql =
    "SELECT * from tblauction a,tblimage i where a.imgid=i.imgid and a.aucstatus='true' ORDER BY endstatus LIMIT 0,8 ";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.json(results);
    }
  });
});
app.put("/api/editusers/:userid", (req, res) => {
  const { userid } = req.params;
  const {
    username,
    emailid,
    profilephoto,
    coverphoto,
    cityid,
    contactno,
    bio,
    photographer,
  } = req.body;
  const sql =
    "UPDATE tblusers SET username=?,emailid=?,profilephoto=?,coverphoto=?,cityid=?,contactno=?,bio=?,photographer=? where userid=?";
  const values = [
    username,
    emailid,
    profilephoto,
    coverphoto,
    cityid,
    contactno,
    bio,
    photographer,
    userid,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      db.query(
        "SELECT * FROM tblusers u,tblcity c where u.cityid=c.cityid",
        (err, results) => {
          if (err) {
            console.error(err);
          } else {
            res.json(results);
            // console.log(results);
          }
        }
      );
    }
  });
});
app.get("/api/editimg/:imgid", (req, res) => {
  const { imgid } = req.params;
  db.query("SELECT * FROM tblimage WHERE imgid=?", [imgid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Image not found" });
      } else {
        res.json(results[0]);
      }
    }
  });
});
app.put("/api/editimg/:imgid", (req, res) => {
  const { imgid } = req.params;
  const { imgname, mrp, discount, description } = req.body;
  const sql =
    "UPDATE tblimage SET imgname=?,mrp=?,discount=?,description=? where imgid=?";
  const values = [imgname, mrp, discount, description, imgid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
    }
  });
});
app.post("/api/wishlist", (req, res) => {
  const { imgid } = req.body;
  const { userid } = req.body;
  const sql = "INSERT into tblwishlist(imgid,userid) values(?,?)";
  const values = [imgid, userid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({
        message: "Data Inserted Succesfully",
      });
    }
  });
});
app.get("/api/whishdisplay/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT * FROM tblwishlist w,tblimage i WHERE w.imgid=i.imgid AND w.userid=?",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Auction not found" });
        } else {
          res.json(results);
        }
      }
    }
  );
});
app.delete("/api/wishdelete/:wishlistid", (req, res) => {
  const { wishlistid } = req.params;
  const sql = "DELETE FROM tblwishlist WHERE wishlistid = ?";
  const values = [wishlistid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Data Deleted", results });
    }
  });
});
app.get("/api/aucdetails/:auctionid", (req, res) => {
  const { auctionid } = req.params;
  db.query(
    "SELECT * FROM tblauction a,tblimage i,tblusers u where a.imgid=i.imgid and i.userid=u.userid and a.auctionid=?",
    [auctionid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "auction details not found" });
        } else {
          res.json(results[0]);
        }
      }
    }
  );
});
app.get("/api/maxbid/:auctionid", (req, res) => {
  const { auctionid } = req.params;
  const sql = "SELECT MAX(bidprice) AS maxprice FROM tblbid WHERE auctionid=?";
  db.query(sql, [auctionid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const maxprice = results[0].maxprice;
      if (maxprice === null) {
        // No bids found for the auction
        res.status(404).json({ error: "No bids found for the auction" });
      } else {
        // Return the maximum bid price
        res.json({ maxprice });
      }
    }
  });
});
app.put("/api/updstatus/:auctionid", (req, res) => {
  const { auctionid } = req.params;
  const { endstatus, ownerid } = req.body;
  const sql =
    "UPDATE tblauction SET endstatus=? , ownerid = ? WHERE auctionid=?";
  db.query(sql, [endstatus, ownerid, auctionid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      // Fetch the updated totalviews for the specific image
      res.json({ message: "Data Updated Successfully" });
    }
  });
});
app.put("/api/updbid/:auctionid", (req, res) => {
  const { auctionid } = req.params;
  const { auctionAmount } = req.body;
  const sql = "UPDATE tblauction SET auctionAmount=? WHERE auctionid = ?";

  db.query(sql, [auctionAmount, auctionid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      // Fetch the updated totalviews for the specific image
      res.json({ message: "Data Updated Successfully" });
    }
  });
});
app.post("/api/bidins", (req, res) => {
  const { auctionid, imgid, userid, bidprice, bidtime } = req.body;
  const sql =
    "INSERT into tblbid(auctionid,imgid,userid,bidprice,bidtime) values(?,?,?,?,?)";
  const values = [auctionid, imgid, userid, bidprice, bidtime];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({
        message: "Data Inserted Succesfully",
        newBidAmount: bidprice,
      });
    }
  });
});
app.get("/api/biddata/:auctionid", (req, res) => {
  const { auctionid } = req.params;
  db.query(
    "SELECT * FROM tblbid b,tblimage i,tblusers u where b.imgid=i.imgid and b.userid=u.userid and auctionid=? order by bidprice DESC",
    [auctionid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Auction not found" });
        } else {
          res.json(results);
        }
      }
    }
  );
});
app.get("/api/editusers/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT * FROM tblusers u,tblcity c where u.cityid=c.cityid and u.userid=?",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Auction not found" });
        } else {
          res.json(results[0]);
        }
      }
    }
  );
});
app.post("/api/nav", (req, res) => {
  const { userid } = req.body;

  if (!userid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = "SELECT * FROM tblusers WHERE userid = ?";
  db.query(sql, [userid], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("User data:", results[0]);
    res.json(results[0]);
  });
});
app.post("/api/users", (req, res) => {
  const { userid } = req.body;
  sql = "SELECT * FROM tblusers WHERE userid=?";
  db.query(sql, [userid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/users/images", (req, res) => {
  const { userid } = req.body;
  sql =
    "SELECT * FROM tblimage WHERE userid=? AND status='true' AND inAuction='false'";
  db.query(sql, [userid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.post("/api/messageins", (req, res) => {
  const { userid, ntitle, ntype } = req.body;
  sql = "INSERT INTO tblnotification(userid,ntitle,ntype) values(?,?,?)";
  const values = [userid, ntitle, ntype];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
app.get("/api/notifications/:userid", (req, res) => {
  const { userid } = req.params;
  sql =
    "SELECT * FROM tblnotification n,tblusers u WHERE n.userid=u.userid and n.userid=?";
  db.query(sql, [userid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/followers/:followersid", (req, res) => {
  const { followersid } = req.params;
  sql =
    "SELECT i.*, u.*, f.* FROM tblimage i, tblusers u, tblfollow f WHERE i.userid = u.userid AND u.userid = f.userid AND f.followersid =?;";
  db.query(sql, [followersid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.post("/api/auctionform", (req, res) => {
  const {
    imgid,
    createdDt,
    auctionAmount,
    startDate,
    endDate,
    aucstatus,
    bidDays,
    endstatus,
    sendStatus,
  } = req.body;
  sql =
    "INSERT INTO tblauction(imgid, createdDt, auctionAmount, startDate, endDate, aucstatus, bidDays,endstatus,sendStatus) VALUES (?,?,?,?,?,?,?,?,?)";
  const values = [
    imgid,
    createdDt,
    auctionAmount,
    startDate,
    endDate,
    aucstatus,
    bidDays,
    endstatus,
    sendStatus,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
app.delete("/api/imgdelete/:imgid", (req, res) => {
  const { imgid } = req.params;
  const sql = "DELETE FROM tblimage WHERE imgid = ?";
  const values = [imgid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Data Deleted", results });
    }
  });
});
app.get("/api/auction/:imgid", (req, res) => {
  const { imgid } = req.params;
  db.query(
    "SELECT * FROM tblimage i, tblusers u  WHERE i.userid=u.userid and imgid = ?",
    [imgid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Auction not found" });
        } else {
          res.json(results[0]);
        }
      }
    }
  );
});
app.get("/api/bidDisplay/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT * FROM tblbidwinner b,tblimage i WHERE b.imgid=i.imgid and b.userid=? and b.paymentstatus='false'",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Auction not found" });
        } else {
          res.json(results);
        }
      }
    }
  );
});
app.put("/api/updpayment", (req, res) => {
  const { winid } = req.body;
  const sql = "UPDATE tblbidwinner SET paymentstatus='true' WHERE winid = ?";

  db.query(sql, [winid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      res.json({ message: "Data Updated Successfully" });
    }
  });
});

app.get("/api/display", (req, res) => {
  db.query(
    "SELECT subcatid,subcatname FROM tblsubcategory s,tblcategory c where s.categoryid=c.categoryid",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.put("/api/countview/:imgid", (req, res) => {
  const { imgid } = req.params;
  const sql = "UPDATE tblimage SET totalviews = totalviews + 1 WHERE imgid = ?";
  db.query(sql, imgid, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data Updated Successfully");
      // Fetch the updated totalviews for the specific image
      db.query(
        "SELECT totalviews FROM tblimage WHERE imgid = ?",
        imgid,
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Send the updated totalviews as response
            res.json({ totalviews: results[0].totalviews });
          }
        }
      );
    }
  });
});

app.get("/api/data/:imgid", (req, res) => {
  const { imgid } = req.params;
  const sql =
    "SELECT *,count(totalviews) FROM tblimage i,tblsubcategory c,tblusers u  WHERE i.subcatid=c.subcatid and i.userid=u.userid  and imgid  =  ?";
  db.query(sql, [imgid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results[0]);
    }
  });
});
app.get("/api/disphoto/:followersid", (req, res) => {
  const { followersid } = req.params;
  db.query(
    "SELECT * from tblusers u WHERE u.photographer='true' AND u.status='false' AND u.userid NOT IN(select userid from tblfollow where followersid=?)",
    [followersid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.get("/api/disfollowers/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT * from tblfollow f,tblusers u where f.followersid=u.userid AND f.userid=?",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.post("/api/followins", (req, res) => {
  const { followersid, userid } = req.body;
  const sql = "INSERT INTO tblfollow(followersid,userid) VALUES (?,?)";
  const values = [followersid, userid];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
app.get("/api/totalfollowings/:followersid", (req, res) => {
  const { followersid } = req.params;
  db.query(
    "SELECT count(*) AS totalfollowings from tblusers u WHERE  u.photographer='true' AND u.userid IN(select userid from tblfollow where followersid=?)",
    [followersid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        const totalfollowings = results[0].totalfollowings;
        res.json({ totalfollowings });
      }
    }
  );
});
app.get("/api/totalposts/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT count(*) AS totalposts from tblimage i,tblusers u WHERE i.userid=u.userid and i.userid=? and i.inAuction='false'",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        const totalposts = results[0].totalposts;
        res.json({ totalposts });
      }
    }
  );
});
app.get("/api/totalfollowers/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "SELECT count(*) AS totalfollowers from tblfollow f,tblusers u where f.followersid=u.userid AND f.userid=?",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        const totalfollowers = results[0].totalfollowers;
        res.json({ totalfollowers });
      }
    }
  );
});
app.get("/api/followdisplay/:followersid", (req, res) => {
  const { followersid } = req.params;
  db.query(
    "SELECT * from tblusers u WHERE  u.photographer='true' AND u.userid IN(select userid from tblfollow where followersid=?)",
    [followersid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.delete("/api/followdelete/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    "DELETE FROM tblfollow WHERE userid = ?",
    [userid],
    (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Data Deleted", results });
      }
    }
  );
});
app.post("/api/contactins", (req, res) => {
  const { userid, emailid, subject, message } = req.body;
  const sql =
    "INSERT INTO tblcontact(userid,emailid,subject,message) values(?,?,?,?)";
  const values = [userid, emailid, subject, message];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
app.get("/api/disimg", (req, res) => {
  db.query(
    "SELECT * from tblimage i,tblsubcategory s,tblusers u where i.userid=u.userid and i.subcatid=s.subcatid and i.status='true' and i.inAuction='false' ORDER BY addedDt desc",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.get("/api/dishomeimg", (req, res) => {
  db.query(
    "SELECT * from tblimage i,tblsubcategory s,tblusers u where i.userid=u.userid and i.subcatid=s.subcatid and i.status='true' and i.inAuction='false' LIMIT 1,4",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.post("/api/imageins", (req, res) => {
  const {
    userid,
    imgname,
    imgurl,
    status,
    addedDt,
    totalDownloads,
    totalviews,
    mrp,
    discount,
    subcatid,
    description,
  } = req.body;
  const sql =
    "INSERT INTO tblimage(userid,imgname, imgurl, status, addedDt, totaldownloads, totalviews, mrp, discount, subcatid,description) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    userid,
    imgname,
    imgurl,
    status,
    addedDt,
    totalDownloads,
    totalviews,
    mrp,
    discount,
    subcatid,
    description,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: "Token Not Provided" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.json(err);
    }
    req.user = decoded;
    next();
  });
}
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected endpoint access succefully" });
});
app.post("/api/data", (req, res) => {
  const {
    username,
    password,
    emailid,
    profilephoto,
    coverphoto,
    cityid,
    contactno,
    bio,
    regdate,
    status,
    gender,
    photographer,
  } = req.body;
  const sql =
    "INSERT INTO tblusers(username,password,emailid,profilephoto,coverphoto,cityid,contactno,bio,regdate,status,gender,photographer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    username,
    password,
    emailid,
    profilephoto,
    coverphoto,
    cityid,
    contactno,
    bio,
    regdate,
    status,
    gender,
    photographer,
  ];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("Data Inserted Succesfully");
    }
  });
});
app.post("/api/login", (req, res) => {
  const { password, emailid } = req.body;
  const sql = "SELECT * FROM tblusers WHERE password=? AND emailid=?";
  db.query(sql, [password, emailid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        if (results[0].status === "true") {
          return res.status(401).json({
            error:
              "Your account has been blocked. Please contact support for assistance.",
          });
        }
        const token = jwt.sign({ emailid }, secretKey, { expiresIn: "1h" });
        console.log(results);
        const id = results[0].userid;
        const photographer = results[0].photographer;
        res.json({ token, id, photographer });
      } else {
        res.status(401).json({ error: "Email ID and password not found" });
      }
    }
  });
});

app.post("/api/threadins", (req, res) => {
  const { userid, imgid, status, thcreatedDt, title, thdescription } = req.body;
  const sql =
    "INSERT INTO tblthread(userid,imgid,status,thcreatedDt,title,thdescription) values(?,?,?,?,?,?)";
  const values = [userid, imgid, status, thcreatedDt, title, thdescription];
  db.query(sql, values, (err, values) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("INSERTED successfully");
    }
  });
});
app.get("/api/displaythread/:imgid", (req, res) => {
  const { imgid } = req.params;
  db.query(
    "SELECT * from tblthread t,tblusers u,tblimage i WHERE t.userid=u.userid and t.imgid=i.imgid and t.imgid=?",
    [imgid],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        // console.log(results);
        res.json(results);
      }
    }
  );
});
app.get("/api/singlethread/:threadid", (req, res) => {
  const { threadid } = req.params;
  db.query(
    "SELECT * from tblthread t,tblusers u WHERE t.userid=u.userid and  threadid=?",
    [threadid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "auction details not found" });
        } else {
          res.json(results[0]);
        }
      }
    }
  );
});
app.post("/api/commentins", (req, res) => {
  const { threadid, userid, comment } = req.body;
  const sql =
    "INSERT INTO tblthreadcomment(threadid,userid,comment) values(?,?,?)";
  const values = [threadid, userid, comment];
  db.query(sql, values, (err, values) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json("INSERTED successfully");
    }
  });
});
app.get("/api/displaycomments/:tid", (req, res) => {
  const { tid } = req.params;
  db.query(
    "SELECT * from tblthreadcomment t,tblusers u where t.userid=u.userid and  t.threadid  = ?",
    [tid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.get("/api/data", (req, res) => {
  db.query(
    "SELECT cityid,cityname FROM tblcity c,tblstate s where c.stateid=s.stateid",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});
app.get("/api/search", async (req, res) => {
  const searchTerm = req.query.q;
  const sql = `SELECT i.*, s.*, u.* FROM tblimage i, tblsubcategory s, tblusers u WHERE i.userid = u.userid AND i.subcatid = s.subcatid AND i.status = 'true' AND i.inAuction = 'false' AND i.imgname LIKE '%${searchTerm}%';`;
  db.query(sql, [searchTerm], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});
app.listen(port, () => {
  console.log("server connected to port :" + port);
});

// `SELECT * FROM tblimage WHERE imgname LIKE '%${imgname}%';
