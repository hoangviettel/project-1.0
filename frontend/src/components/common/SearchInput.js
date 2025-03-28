import React from 'react';

const SearchInput = ({ placeholder, value, onChange }) => (
	<input type="text" placeholder={placeholder} value={value} onChange={onChange} />
);

export default SearchInput;
