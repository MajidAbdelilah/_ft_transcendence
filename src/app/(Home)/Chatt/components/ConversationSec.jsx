"use client";

import React from 'react';
import Image from 'next/image';


export default function ConversationSec ({ selectedFriend}) {

    if (selectedFriend === null) {
        return (
            <div className="noFriendSelected p-5 text-gray-500">
                <h3>No friend selected yet.</h3>
            </div>
        );
    }
    return (
        <div className="selectedFriendInfo p-5">
        <h3>Selected Friend: {selectedFriend.username}</h3>
        <Image
          src={selectedFriend.image_url}
          alt="Friend Avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
      </div>
    );

}