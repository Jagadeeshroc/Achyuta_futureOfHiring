// src/components/pages/ConversationList.jsx
import React from "react";
import { format } from "date-fns";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getOtherUser = (participants, currentUser) => {
  if (!participants || !currentUser) return null;
  return participants.find((p) => p?._id !== currentUser?._id);
};

export const ConversationList = ({
  conversations,
  currentUser,
  activeConversationId,
  onSelectConversation,
  loading,
}) => {
  if (loading) {
    return (
      <div className="p-4! text-center text-gray-500 dark:text-gray-400">
        Loading chats...
      </div>
    );
  }
  if (!conversations.length) {
    return (
      <div className="p-4! text-center text-gray-500 dark:text-gray-400">
        No conversations yet.
      </div>
    );
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="flex-1 overflow-y-auto">
           {" "}
      {sortedConversations.map((convo) => {
        const otherUser = getOtherUser(convo.participants, currentUser);
        if (!otherUser) return null;

        const isActive = convo._id === activeConversationId;
        const avatarSrc = otherUser.avatar
          ? `${API_URL}${otherUser.avatar}`
          : "https://i.pravatar.cc/40";

        return (
          <div
            key={convo._id}
            onClick={() => onSelectConversation(convo)}
            className={`flex items-center p-4! cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
              isActive
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
                       {" "}
            <img
              src={avatarSrc}
              alt={otherUser.name || "User"}
              className="w-12 h-12 rounded-full mr-4!"
            />
                       {" "}
            <div className="flex-1 overflow-hidden">
                           {" "}
              <div className="flex justify-between items-center">
                               {" "}
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                                    {otherUser.name || "Jobby User"}           
                     {" "}
                </h3>
                               {" "}
                {convo.lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                       {" "}
                    {format(new Date(convo.lastMessage.createdAt), "p")}       
                             {" "}
                  </span>
                )}
                             {" "}
              </div>
                           {" "}
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                               {" "}
                {convo.lastMessage
                  ? convo.lastMessage.content
                  : "No messages yet"}
                             {" "}
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
        );
      })}
         {" "}
    </div>
  );
};
