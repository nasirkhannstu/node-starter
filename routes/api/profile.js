const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const Profile = require('../../models/Profile')

// @route   GET api/profile
// @desc    Test route
// @access  Public
router.get("/", (req, res) => {
    try {
        res.send('Response');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});
router.post("/",auth, async (req, res) => {
    const { status, skills } = req.body;
    try {
        const prof = {};
        prof.user = req.user.id;
        prof.status = status;
        prof.skills = skills.split(",").map((s) => s.trim());
        // return res.send(prof);

        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: prof },
              { new: true }
            );
            return res.send(profile);
        }
        profile = await new Profile(prof);
        profile.save();
        res.send(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
