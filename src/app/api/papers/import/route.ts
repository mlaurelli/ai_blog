import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Manual paper import triggered by admin...');

    // Execute the daily import script
    const { stdout, stderr } = await execAsync('npm run daily-import-papers', {
      cwd: process.cwd(),
      env: { ...process.env },
      timeout: 600000, // 10 minutes timeout
    });

    // Parse output to extract useful information
    const output = stdout + stderr;
    
    // Extract number of new papers
    const newPapersMatch = output.match(/(\d+) new papers to import/);
    const newPapersCount = newPapersMatch ? parseInt(newPapersMatch[1]) : 0;
    
    // Check if import was successful
    const successMatch = output.match(/Successfully imported (\d+) new papers/);
    const wasSuccessful = !!successMatch;
    
    // Check if no new papers
    const noNewPapers = output.includes('No new papers to import');

    if (noNewPapers) {
      return NextResponse.json({
        success: true,
        message: 'No new papers to import. All papers are up to date.',
        newPapers: 0,
        output: output.substring(0, 2000), // Limit output size
      });
    }

    if (wasSuccessful) {
      const importedCount = successMatch ? parseInt(successMatch[1]) : newPapersCount;
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${importedCount} new papers!`,
        newPapers: importedCount,
        output: output.substring(0, 2000),
      });
    }

    // If we get here, something might have gone wrong
    return NextResponse.json({
      success: false,
      message: 'Import completed but status unclear. Check logs for details.',
      output: output.substring(0, 2000),
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error during manual paper import:', error);
    
    // Check if it's a timeout error
    if (error.killed && error.signal === 'SIGTERM') {
      return NextResponse.json({
        error: 'Import timeout. The process is taking too long. It may still be running in the background.',
        details: error.message,
      }, { status: 408 });
    }

    return NextResponse.json({
      error: 'Failed to import papers',
      details: error.message,
      stdout: error.stdout?.substring(0, 1000),
      stderr: error.stderr?.substring(0, 1000),
    }, { status: 500 });
  }
}

// GET endpoint to check import status
export async function GET(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if import is currently running
    try {
      const { stdout } = await execAsync('ps aux | grep "daily-import-papers" | grep -v grep');
      const isRunning = stdout.trim().length > 0;
      
      return NextResponse.json({
        isRunning,
        message: isRunning ? 'Import is currently running' : 'No import running',
      });
    } catch (error) {
      // No process found - not running
      return NextResponse.json({
        isRunning: false,
        message: 'No import running',
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check import status',
      details: error.message,
    }, { status: 500 });
  }
}
