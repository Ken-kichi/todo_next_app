'use client';

import Layout from '@/components/Layout';
import { User } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManagementPage() {
  const router = useRouter();
  const token = Cookies.get('token');
  const loginUser: User = Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!loginUser.is_manager) {
      router.push('/');
    }

    axios
      .get('http://localhost:8000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setUsers([]);
        } else if (error.response && error.response.status === 401) {
          router.push('/');
        } else {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-gray-500 text-lg">Leading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex justify-end items-center mb-4 mr-6">
        <button
          onClick={() => router.push('/management/add')}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {users && users?.length > 0 ? (
        users?.map((user: User, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {user.username}
              {user?.is_manager ? (
                <span className="rounded-full bg-green-600 px-3 py-1.5 font-medium text-white ml-2">
                  Manager
                </span>
              ) : (
                <span className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white ml-2">
                  General
                </span>
              )}
            </h2>
            <p className="text-gray-700 mb-4">{user.email}</p>

            <div className="flex justify-between items-center">
              {user?.disabled ? (
                <span className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white">
                  Disabled
                </span>
              ) : (
                <span className="rounded-full bg-green-600 px-3 py-1.5 font-medium text-white">
                  Validity
                </span>
              )}

              <button
                onClick={() => router.push(`/management/user/${user.id}`)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Detail
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>User not found</p>
      )}
    </Layout>
  );
}
