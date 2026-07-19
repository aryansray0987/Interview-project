import express from 'express'
import { authUser } from '../middlewares/auth.middleware.js'
import {generateInterViewReportController,getAllInterviewReportsController,generateResumePdfController,getInterviewReportByIdController} from '../controllers/interview.controller.js'
import { upload } from '../middlewares/file.middleware.js'

const interviewRouter = express.Router()

// Wrapper to make file upload optional - doesn't error when no file is provided
const optionalUpload = (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
        // If multer error is about missing file, just continue without the file
        if (err) {
            console.error("Multer error:", err.message);
            // Continue anyway - file is optional
        }
        next();
    });
};


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authUser, optionalUpload, generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)



export { interviewRouter };