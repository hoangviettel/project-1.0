import React from 'react';

const DeleteButton = ({ onClick, isLoading, disabled }) => (
	<button onClick={onClick} disabled={isLoading || disabled}>
		{isLoading ? 'Deleting...' : 'Delete'}
	</button>
);

export default DeleteButton;
