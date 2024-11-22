import { signIn, ILogin } from '@/services/cognito';

import useSWRMutation from 'swr/mutation';

function useLogin() {
    return useSWRMutation('login', (_, { arg }: { arg: ILogin }) => signIn(arg));
};


export { useLogin };