import { useLogin } from "@/hooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters and include uppercase, lowercase, number & symbol."),
});

const Login = () => {
    const { login, error, isLoading } = useLogin();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" }
    });

    const handleSubmit = async (data) => {
        const { email, password } = data;
        await login(email, password);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[400px] shadow-lg">
                <CardHeader className="m-0 px-[52px] pt-[44px] pb-0">
                    <CardTitle className="text-2xl font-gotu">Log In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-0 space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <div className="error">{error}</div>}
                            <Button type="submit" disabled={isLoading}>Log In</Button>
                        </form>
                    </Form>
                    <p className="mt-4 px-[28px]">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;