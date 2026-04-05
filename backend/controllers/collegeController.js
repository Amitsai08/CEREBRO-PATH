import College from '../models/College.js';

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
export const getColleges = async (req, res) => {
    try {
        const { district, type, course, page = 1, limit = 12 } = req.query;
        let query = {};
        
        // Dynamic Optional Filtering
        if (district) query.district = { $regex: new RegExp(district, 'i') };
        if (type) query.type = { $regex: new RegExp(type, 'i') };
        if (course) query['courses.course_name'] = { $regex: new RegExp(course, 'i') };

        const skip = (page - 1) * limit;
        
        const totalColleges = await College.countDocuments(query);
        const colleges = await College.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            colleges,
            totalPages: Math.ceil(totalColleges / limit),
            currentPage: parseInt(page),
            totalColleges
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching Colleges', error: error.message });
    }
};

// @desc    Get single college details
// @route   GET /api/colleges/:id
// @access  Public
export const getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (college) {
            res.json(college);
        } else {
            res.status(404).json({ message: 'College not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
