const express = require("express");
const router = new express.Router();
const { postModel } = require("../models/db");
const fileupload = require("express-fileupload");
const moment = require("moment");
const fs = require("fs");
router.use(express.json());

router.use(fileupload());

//--------create Employeee------------

router.post("/post", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";
  const validInputs = [];

  if (!req.body?.name?.trim()) {
    validInputs.push("The name field is required");
  }
  if (!req.body?.email?.trim()) {
    validInputs.push("The email field is required");
  }
  if (!req.body?.mobileNo?.trim()) {
    validInputs.push("The Mobile number field is required");
  }
  if (!req.body?.Designation?.trim()) {
    validInputs.push("The Designation field is required");
  }
  if (!req.body?.status?.trim()) {
    validInputs.push("The status field is required");
  }
  if (!req.body?.gender?.trim()) {
    validInputs.push("The gender field is required");
  }
  if (!req.body?.course?.trim()) {
    validInputs.push("The course field is required");
  }
  if (!req.files?.image) {
    validInputs.push("The image field is required");
  }
  if (validInputs?.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ status, message: validInputs });
  }

  try {
    const image = req.files?.image;
    image.mv(`../backend/files/${image.name}`);
    const data = {
      name: req.body?.name,
      email: req.body?.email,
      mobileNo: req.body?.mobileNo,
      Designation: req.body?.Designation,
      status: req.body?.status,
      gender: req.body?.gender,
      course: req.body?.course,
      // image: `./files/${image.name}`,
      image: `${image.name}`,
      created_date: moment().toDate(),
      updated_date: moment().toDate(),
    };
    // console.log(data);
    const posts = await new postModel(data).save();
    // posts.save(data);

    if (posts) {
      status = "succses";
      reqStatus = 201;
      message = "The post is created ";
      insertedId = posts?.insertedId;
    }
  } catch (err) {
    console.log(err);
    message = err;
  }
  return res.status(reqStatus).json({ status, message, id: insertedId });
});

//-----------Geting the list of employee--------

router.get("/post", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let data = null;
  let message = "Something went wrong. Please try again!";

  try {
    const posts = await postModel.find();
    if (posts) {
      status = "success";
      message = "Posts found!";
      reqStatus = 200;
      data = posts;
    }
  } catch (error) {
    console.log(error);
    message = error;
  }

  return res.status(reqStatus).json({ status, message, data });
});

//-------getting posts by id-----------------

router.get("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let data = null;
  let message = "Something went wrong. Please try again!";

  try {
    const _id = req.params?.id;
    const post = await postModel.findById(_id);
    if (post) {
      status = "success";
      message = "Post found!";
      reqStatus = 200;
      data = post;
    }
  } catch (error) {
    message = error;
  }

  return res.status(reqStatus).json({ status, message, data });
});

//----------Updateing the posts-----------------

router.put("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";
  const validInputs = [];

  if (!req.body?.name?.trim()) {
    validInputs.push("The name field is required");
  }
  if (!req.body?.email?.trim()) {
    validInputs.push("The email field is required");
  }
  if (!req.body?.mobileNo?.trim()) {
    validInputs.push("The Mobile number field is required");
  }
  if (!req.body?.Designation?.trim()) {
    validInputs.push("The Designation field is required");
  }
  if (!req.body?.status?.trim()) {
    validInputs.push("The status field is required");
  }
  if (!req.body?.gender?.trim()) {
    validInputs.push("The gender field is required");
  }
  if (!req.body?.course?.trim()) {
    validInputs.push("The course field is required");
  }
  // if (!req.files?.image) {
  //   validInputs.push("The image field is required");
  // }
  if (validInputs?.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ status, message: validInputs });
  }

  try {
    const postId = req.params?.id;
    const image = req.files?.image;
    let updateData = {
      name: req.body?.name,
      email: req.body?.email,
      mobileNo: req.body?.mobileNo,
      Designation: req.body?.Designation,
      status: req.body?.status,
      gender: req.body?.gender,
      course: req.body?.course,
      updated_date: moment().toDate(),
    };
    // Here the fs module {fs/promises} is require
    if (image) {
      const exisingPost = await postModel.findById(postId);
      // const newImagePath = `../files/${image?.name}`;
      // fs.unlinkSync(exisingPost.image?.replace("./", "../"));
      const newImagePath = `../backend/files/${image.name}`;
      fs.unlinkSync(`../backend/files/${exisingPost.image}`);
      image.mv(newImagePath);
      updateData = {
        ...updateData,
        image: `${image?.name}`,
      };
    }

    const posts = await postModel.findByIdAndUpdate(
      { _id: postId },
      updateData
    );

    if (posts) {
      status = "success";
      message = "Post updated successfully!";
      reqStatus = 200;
      insertedId = posts?.insertedId;
    }
  } catch (error) {
    (message = error),
      "May be the Image is Not present in the folders, try to delete the user and create new";
    console.log(error);
  }

  return res.status(reqStatus).json({ status, message, id: insertedId });
});

//----------Delete --------------------

router.delete("/post/:id", async (req, res) => {
  let status = "error";
  let reqStatus = 400;
  let insertedId = undefined;
  let message = "Something went wrong. Please try again!";

  try {
    const postId = req.params?.id;
    const post = await postModel.findByIdAndDelete({ _id: postId });

    if (post) {
      fs.unlinkSync(`../backend/files/${post.image}`);
      status = "success";
      message = "Post deleted successfully!";
      reqStatus = 200;
    }
  } catch (error) {
    message = error;
  }

  return res.status(reqStatus).json({ status, message, id: insertedId });
});

module.exports = router;
