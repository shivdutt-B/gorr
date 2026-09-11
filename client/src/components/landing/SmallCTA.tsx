import React from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { useLoading } from "../../hooks/useLoading";
import { cn } from "../../utils/cn";

export function SmallCTA() {
  const user = useRecoilValue(userAtom);
  const { isRequestLoading } = useLoading();
  const isUserLoading = isRequestLoading("FetchUser");

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-8 sm:py-12">
      <div className="container-gutter">
        <div
          className="
            relative
            overflow-hidden
          "
        >
          {/* Accent glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-1/3
              h-56
              w-56
              rounded-full
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-7
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Content */}
            <div>
              <h2
                className="
                  font-serif
                  text-[clamp(1.8rem,3vw,2.6rem)]
                  font-normal
                  leading-[1.05]
                  tracking-[-0.03em]
                  text-[hsl(var(--text-primary))]
                "
              >
                Ready to make your next release{" "}
                <span className="text-accent">effortless?</span>
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-[0.9rem]
                  leading-relaxed
                  text-[hsl(var(--text-secondary))]
                "
              >
                Deploy your application with less infrastructure and more
                confidence.
              </p>
            </div>

            {/* CTA */}
            <Link
              to={isUserLoading ? "#" : (user ? "/dashboard" : "/join")}
              onClick={(e) => {
                if (isUserLoading) e.preventDefault();
              }}
              className={cn(
                "group inline-flex shrink-0 items-center gap-3 rounded-[4px] bg-[hsl(var(--accent))] py-2 pl-5 pr-2 text-[0.85rem] font-medium text-[#030303]",
                isUserLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              <span>Start deploying</span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-[3px]
                  bg-[#030303]
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              >
                {isUserLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--accent))]" />
                ) : (
                  <ArrowUpRight
                    className="h-4 w-4 text-[hsl(var(--accent))]"
                    strokeWidth={1.7}
                  />
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}