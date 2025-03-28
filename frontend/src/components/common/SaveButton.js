import React from 'react';

const SaveButton = ({ isLoading, isEdit, onClick, disabled }) => (
	<button onClick={onClick} disabled={isLoading || disabled} type={onClick ? 'button' : 'submit'}>
		{isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
	</button>
);

export default SaveButton;
