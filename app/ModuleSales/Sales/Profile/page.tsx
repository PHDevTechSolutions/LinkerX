"use client";

import React from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import ProfileForm from "../../components/Profile/ProfileForm";
import GenerateCode from "../../components/Profile/GenerateCode";

const ProfilePage: React.FC = () => {
  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-lg font-bold mb-6">Update Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-3 bg-white rounded-md p-6 shadow-md">
              <ProfileForm />
            </div>
            <div className="col-span-1 bg-white rounded-md p-6 shadow-md">
              <GenerateCode />
            </div>
          </div>
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ProfilePage;
