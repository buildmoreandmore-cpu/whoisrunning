import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Home, Users } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-gray-700 mb-6">
          Your contribution helps keep democracy free, accurate, and accessible
          for everyone.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8 border-l-4 border-blue-600">
          <Heart className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700 mb-3 font-medium">
            You just helped thousands of voters make informed decisions.
          </p>
          <p className="text-sm text-gray-600 mb-2">
            A receipt has been sent to your email.
          </p>
          <p className="text-sm text-gray-600">
            Your contribution funds candidate verification, community corrections,
            and keeps us ad-free forever.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 font-semibold mb-2">
            Want to be recognized?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Check your email for instructions on joining our Democracy Contributors page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="font-bold">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="font-semibold">
            <Link href="/contributors">
              <Users className="mr-2 h-5 w-5" />
              See All Contributors
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@whoisrunning.org"
              className="text-blue-600 hover:underline"
            >
              support@whoisrunning.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
