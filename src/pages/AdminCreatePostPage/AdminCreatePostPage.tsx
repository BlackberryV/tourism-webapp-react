import React, {FC} from 'react';
import CreatePostForm from "../../components/CreatePostForm";
import AdminNavigationPanel from "../../components/AdminNavigationPanel";

const AdminCreatePostPage: FC = () => {
    return (
        <div className='page-container create-page'>
            <AdminNavigationPanel/>
            <CreatePostForm/>
        </div>
    );
};

export default AdminCreatePostPage;