import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {jwtDecode} from 'jwt-decode';
import { logout } from './authSlice';
const authUrl = '/api/auth'
const taskUrl = '/api/tasks'
const baseQuery = fetchBaseQuery({baseUrl:process.env.REACT_APP_BASEURL,
    credentials:'include',
    prepareHeaders:(headers,{getState})=>{
      const token = getState().auth.userInfo?.jwt;
      if(token){
        headers.set('Authorization',`Bearer ${token}`)
      }
      return headers 
    }
})

const baseQueryWithAuthCheck = async (args,api,extraOptions)=>{
  const state = api.getState();
  const token = state.auth.userInfo?.jwt;
  const currentTime = Date.now() / 1000;

  // Skip token validation for login and register requests
if (args?.url?.includes(`${authUrl}/login`) || args?.url?.includes(`${authUrl}/register`)) {
  return baseQuery(args, api, extraOptions);
}
  if (!token) {
    console.warn('No token found, logging out');
    api.dispatch(logout());
    return { error: { status: 401, data: 'No token found' } };
  }

  
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < currentTime) {
        // Token is expired
        api.dispatch(logout());
        return { error: { status: 401, data: 'Token expired' } };

      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      api.dispatch(logout());
      return { error: { status: 401, data: 'Invalid token' } };
    }
  
  return baseQuery(args, api, extraOptions);
}

export const apiSlice = createApi({
baseQuery:baseQueryWithAuthCheck,
tagTypes:['User'],
endpoints:(builder)=>({
    login:builder.mutation({
        query:(data)=>({
            url:`${authUrl}/login`,
            method:'POST',
            body:data
        })
    }),
    register:builder.mutation({
       query:(data)=>({
        url:`${authUrl}/register`,
        method:'POST',
        body:data
       })
    }),
    getTasks:builder.query({
        query:(status)=>(status ? `${taskUrl}?status=${status}` : taskUrl)
    }),
    createTask: builder.mutation({
        query: (newTask) => ({
          url: `${taskUrl}`,
          method: 'POST',
          body: newTask,
        }),
      }),
      markTaskCompleted: builder.mutation({
        query: (taskId) => ({
          url: `${taskUrl}/${taskId}/complete`,
          method: 'PATCH',
        }),
        invalidatesTags: ['Task'],
      }),
      deleteTask: builder.mutation({
        query: (taskId) => ({
          url: `${taskUrl}/${taskId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Task'],
      }),
      editTask: builder.mutation({
        query: ({ taskId, taskData }) => ({
          url: `${taskUrl}/${taskId}`,
          method: 'PUT',
          body: taskData,
        }),
        invalidatesTags: ['Task'],
      }),
      getTaskStatistics: builder.query({
        query: () => `${taskUrl}/stats`, // Endpoint to fetch task statistics
        providesTags: ['Task'],
      }),


}),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useEditTaskMutation,
    useMarkTaskCompletedMutation,
    useGetTaskStatisticsQuery
} = apiSlice