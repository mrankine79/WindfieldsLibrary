'use client';

import { useState } from 'react';

export default function BookCover({ isbn, title, stamp }) {
  const [broken, setBroken] = useState(!isbn);

  return (
    <div className="cover">
      {broken && (
        <span className="no-cover">No cover<br />available</span>
      )}
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
          alt={`Cover of ${title}`}
          onError={() => setBroken(true)}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth < 10) setBroken(true);
          }}
        />
      )}
      {stamp ? <span className="stamp">{stamp}</span> : null}
    </div>
  );
}
