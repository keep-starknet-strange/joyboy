import * as React from 'react';
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      fill="#1E2F3D"
      fillOpacity={0.5}
      d="M16.777 15.363a2.23 2.23 0 0 1 2.278.54l3.042 3.042a2.23 2.23 0 0 1-3.152 3.152l-3.042-3.042a2.23 2.23 0 0 1-.54-2.278l-2.07-2.07 1.414-1.414 2.07 2.07Z"
    />
    <path
      fill="#1E2F3D"
      fillOpacity={0.5}
      fillRule="evenodd"
      d="M1 9a8 8 0 1 1 16 0A8 8 0 0 1 1 9Zm8-6a6 6 0 1 0 0 12A6 6 0 0 0 9 3Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SearchIcon;
