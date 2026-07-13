"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui";
import type { Hotel } from "@/types";
import { cn, formatCurrency, formatRating, formatReviewCount } from "@/utils";

export interface HotelCardProps {
  hotel: Hotel;
  index?: number;
  className?: string;
}

export function HotelCard({ hotel, index = 0, className }: HotelCardProps) {
  const priceDisplay =
    hotel.priceLabel ??
    (hotel.pricePerNight !== undefined
      ? formatCurrency(hotel.pricePerNight, hotel.currency ?? "USD")
      : undefined);

  const content = (
    <Card
      hoverable
      padding="none"
      className="h-full overflow-hidden border-slate-200/80"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {hotel.imageUrl ? (
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image available
          </div>
        )}
        {hotel.stars || hotel.hotelClass ? (
          <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
            {hotel.stars ? `${hotel.stars}★` : hotel.hotelClass}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-primary-700 sm:text-lg">
              {hotel.name}
            </h3>
            {hotel.rating !== undefined ? (
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
                <Star
                  className="size-3.5 fill-primary-600 text-primary-600"
                  aria-hidden
                />
                <span>{formatRating(hotel.rating)}</span>
              </div>
            ) : null}
          </div>

          {hotel.address ? (
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{hotel.address}</span>
            </p>
          ) : null}
        </div>

        {hotel.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {hotel.description}
          </p>
        ) : null}

        {hotel.amenities && hotel.amenities.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Amenities">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <li
                key={amenity}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                {amenity}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400">
            {hotel.reviewCount !== undefined
              ? `${formatReviewCount(hotel.reviewCount)} reviews`
              : "Reviews unavailable"}
          </p>
          <p className="text-right">
            {priceDisplay ? (
              <>
                <span className="text-lg font-semibold text-slate-900">
                  {priceDisplay}
                </span>
                <span className="block text-xs text-slate-500">per night</span>
              </>
            ) : (
              <span className="text-sm text-slate-400">Price unavailable</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.35) }}
      className={className}
    >
      {hotel.link ? (
        <a
          href={hotel.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {content}
        </a>
      ) : (
        <div className="group h-full">{content}</div>
      )}
    </motion.article>
  );
}

export function HotelCardSkeleton({ className }: { className?: string }) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="aspect-[4/3] animate-pulse bg-slate-200/80" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200/80" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200/80" />
        <div className="h-10 w-full animate-pulse rounded-md bg-slate-200/80" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200/80" />
          <div className="h-6 w-16 animate-pulse rounded-md bg-slate-200/80" />
        </div>
      </div>
    </Card>
  );
}
