import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  fetchConnections,
  fetchConnectionRequests,
  fetchAllUsersAction,
  sendConnectionRequestAction,
  acceptConnectionRequestAction,
  fetchUserProfile,
} from "@/config/redux/action/authAction";
import { API_BASE_URL, getImageUrl } from "@/config";

export default function Network() {
  const dispatch = useDispatch();
  const { user, connections, connectionRequests, allUsers } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchConnections());
    dispatch(fetchConnectionRequests());
    dispatch(fetchAllUsersAction());
  }, [dispatch]);

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptConnectionRequestAction(requestId)).then(() => {
      dispatch(fetchConnections());
      dispatch(fetchConnectionRequests());
      dispatch(fetchUserProfile());
    });
  };

  const handleSendRequest = (targetUserId) => {
    dispatch(sendConnectionRequestAction(targetUserId)).then(() => {
      dispatch(fetchConnectionRequests());
      dispatch(fetchAllUsersAction());
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Filter users who are NOT:
  // - the current logged-in user
  // - already in our connections list
  // - already sent us a connection request (they are in connectionRequests)
  const currentUserId = user?._id || user?.id;
  const connectionIds = connections.map((c) => c._id || c.id);
  const pendingSenderIds = connectionRequests.map((r) => r.sender?._id || r.sender?.id);

  const peopleYouMayKnow = allUsers.filter((u) => {
    const uid = u._id || u.id;
    return (
      uid !== currentUserId &&
      !connectionIds.includes(uid) &&
      !pendingSenderIds.includes(uid)
    );
  });

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Column: Manage Network Nav */}
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-800 mb-4">Manage my network</h2>
            <ul className="text-xs text-slate-600 space-y-3 font-medium">
              <li className="flex items-center justify-between hover:text-[#0077b5] cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span>Connections</span>
                </span>
                <span className="font-semibold text-slate-500">{connections.length}</span>
              </li>
              <li className="flex items-center justify-between hover:text-[#0077b5] cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                  <span>Invitations</span>
                </span>
                <span className="font-semibold text-slate-500">{connectionRequests.length}</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Column: Invitations and People Directory */}
        <section className="col-span-12 md:col-span-9 flex flex-col gap-4">
          {/* Invitations Panel */}
          {connectionRequests.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-sm text-slate-800 mb-3">Invitations</h2>
              <div className="flex flex-col gap-3">
                {connectionRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <Link
                      href={`/profile?id=${request.sender?._id || request.sender?.id}`}
                      className="flex items-center gap-3 hover:underline cursor-pointer"
                    >
                      {request.sender?.profilePicture ? (
                        <img
                          src={getImageUrl(request.sender.profilePicture)}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-base">
                          {getInitials(request.sender?.name)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-slate-850">
                          {request.sender?.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {request.sender?.headline || "LinkedIn Member"}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50 transition-all cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections Panel */}
          {connections.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-sm text-slate-800 mb-3">Your Connections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connections.map((c) => (
                  <Link
                    key={c._id || c.id}
                    href={`/profile?id=${c._id || c.id}`}
                    className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 hover:shadow-sm transition-shadow cursor-pointer hover:underline"
                  >
                    {c.profilePicture ? (
                      <img
                        src={getImageUrl(c.profilePicture)}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(c.name)}
                      </div>
                    )}
                    <div className="overflow-hidden text-left">
                      <div className="font-semibold text-xs text-slate-900 truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{c.headline || "LinkedIn Member"}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* People Directory Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-800 mb-4">People you may know</h2>
            {peopleYouMayKnow.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {peopleYouMayKnow.map((u) => {
                  const uid = u._id || u.id;
                  return (
                    <div
                      key={uid}
                      className="border border-slate-200 rounded-lg overflow-hidden flex flex-col items-center p-4 text-center hover:shadow-md transition-shadow duration-150 bg-white"
                    >
                      {/* Avatar */}
                      <Link href={`/profile?id=${uid}`} className="cursor-pointer hover:opacity-80">
                        {u.profilePicture ? (
                          <img
                            src={getImageUrl(u.profilePicture)}
                            alt="avatar"
                            className="w-16 h-16 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#0077b5] text-white flex items-center justify-center font-bold text-lg">
                            {getInitials(u.name)}
                          </div>
                        )}
                      </Link>

                      {/* Name & Headline */}
                      <Link href={`/profile?id=${uid}`} className="font-semibold text-sm text-slate-800 mt-3 hover:underline cursor-pointer block truncate w-full">
                        {u.name}
                      </Link>
                      <span className="text-[10px] text-slate-500 mt-1 h-8 leading-tight line-clamp-2 w-full">
                        {u.headline || "LinkedIn Member"}
                      </span>

                      {/* Action */}
                      <button
                        onClick={() => handleSendRequest(uid)}
                        className="mt-4 px-4 py-1 rounded-full text-xs font-semibold text-[#0077b5] border border-[#0077b5] hover:bg-sky-50 transition-all cursor-pointer w-full flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <span>Connect</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-slate-400 text-center py-6 block">
                No new members found. Keep expanding your network!
              </span>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
