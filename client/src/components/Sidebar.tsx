import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Loader, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

let timeoutId: number | undefined = undefined;

export function Sidebar() {
  const {
    allUsers,
    isUsersLoading,
    getUsers,
    selectedUser,
    setSelectedUser,
    searchUsers,
    isSearchUsers,
  } = useChatStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      searchUsers(searchValue || "");
    }, 400);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  const filteredUsers = showOnlineOnly
    ? allUsers.filter((user) => onlineUsers?.includes(user._id))
    : allUsers;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div>
        <label className="input ">
          <input
            type="search"
            required
            placeholder="Search"
            ref={searchInputRef}
            onChange={handleSearch}
          />
        </label>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {isSearchUsers ? (
          <div className="flex items-center justify-center w-full h-[50vh]">
            <Loader className="animate-spin text-base-content" />
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors 
            ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute right-0 bottom-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
}
