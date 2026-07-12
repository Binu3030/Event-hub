import Link from "next/link";


export function CTASection() {
  return (
    <section className="py-12 text-center">
      <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
      
      <Link href="/register">
        <button className="px-6 py-3 bg-blue-600 text-white rounded">
          Sign Up Now
        </button>
      </Link>

    </section>
  )
}
