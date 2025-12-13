import {NextResponse} from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'clicker-frontend',
    version: process.env.npm_package_version || '0.0.1'
  });
}
