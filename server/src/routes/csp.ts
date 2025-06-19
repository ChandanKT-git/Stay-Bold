import { Router } from 'express';
import { cspReportHandler } from '../middleware/csp';

const router = Router();

// CSP violation reporting endpoint
router.post('/csp-report', cspReportHandler);

export default router;