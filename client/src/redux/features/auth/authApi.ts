import { apiSlice } from "../api/apiSlice";
import { userLoggedOut, userLoggedIn, userRegistration } from "./authSlice";
import type { User } from "../../../@types";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

type ActivationData = {
  activation_token: string;
};

type ActivationResponse = {
  success: boolean;
  accessToken: string;
  message?: string;
  user: User;
};

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  accessToken: string;
  user: User;
};

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  userId: string;
  token: string;
  newPassword: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),

    activation: builder.mutation<ActivationResponse, ActivationData>({
      query: ({ activation_token }) => ({
        url: "user/activate",
        method: "POST",
        body: { activation_token },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),

    login: builder.mutation<LoginResponse, LoginData>({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordData
    >({
      query: ({ email }) => ({
        url: "password/forgot",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordData
    >({
      query: ({ userId, token, newPassword }) => ({
        url: `password/reset?token=${token}&id=${userId}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "logout", method: "GET" }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLogoutMutation,
  useLoginMutation,
  useRegisterMutation,
  useActivationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
