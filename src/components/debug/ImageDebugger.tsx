import React, { useState } from 'react';
import { resolveImageUrl, createImageErrorHandler } from '@/utils/imageUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ImageDebugger() {
  const [testPath, setTestPath] = useState('/uploads/test-image.jpg');
  const [resolvedUrl, setResolvedUrl] = useState('');

  const handleResolve = () => {
    const resolved = resolveImageUrl(testPath);
    setResolvedUrl(resolved);
  };

  const testPaths = [
    '/uploads/product-1.jpg',
    'product-2.jpg',
    '/lovable-uploads/image1.jpeg',
    'https://example.com/image.jpg',
    '',
    null,
    undefined
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Image URL Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={testPath}
            onChange={(e) => setTestPath(e.target.value)}
            placeholder="Enter image path to test"
          />
          <Button onClick={handleResolve}>Resolve</Button>
        </div>
        
        {resolvedUrl && (
          <div className="space-y-2">
            <p><strong>Resolved URL:</strong> {resolvedUrl}</p>
            <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
              <img
                src={resolvedUrl}
                alt="Test"
                className="w-full h-full object-cover"
                onError={createImageErrorHandler()}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Test Common Paths:</h3>
          {testPaths.map((path, index) => {
            const resolved = resolveImageUrl(path as string);
            return (
              <div key={index} className="text-sm border-l-2 border-gray-200 pl-2">
                <p><strong>Input:</strong> {path === null ? 'null' : path === undefined ? 'undefined' : `"${path}"`}</p>
                <p><strong>Resolved:</strong> {resolved}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables:</h3>
          <p><strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'Not set'}</p>
          <p><strong>VITE_UPLOAD_URL:</strong> {import.meta.env.VITE_UPLOAD_URL || 'Not set'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
