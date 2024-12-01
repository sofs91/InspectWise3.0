import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/Button';

interface SignatureFieldProps {
  onChange: (signature: string) => void;
}

export function SignatureField({ onChange }: SignatureFieldProps) {
  const signatureRef = React.useRef<SignatureCanvas>(null);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onChange('');
    }
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      onChange(signatureRef.current.toDataURL());
    }
  };

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-lg">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: 'signature-canvas w-full h-40 rounded-lg',
          }}
          onEnd={handleEnd}
        />
      </div>
      <Button type="button" variant="secondary" size="sm" onClick={handleClear}>
        Clear Signature
      </Button>
    </div>
  );
}