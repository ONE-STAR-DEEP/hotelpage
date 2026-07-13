"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button, Card, Input } from "@/components/ui";
import { searchFormSchema, type SearchFormValues } from "@/schemas";
import { cn } from "@/utils";
import { useEffect } from "react";

export interface SearchFormProps {
  onSubmit: (values: SearchFormValues) => void;
  defaultValues?: Partial<SearchFormValues>;
  isSubmitting?: boolean;
  variant?: "hero" | "compact";
  className?: string;
}

export function SearchForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  variant = "hero",
  className,
}: SearchFormProps) {
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      q: "Guwahati",
      checkInDate: "",
      checkOutDate: "",
      adults: "",
      children: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        q: "Guwahati",
        checkInDate: "",
        checkOutDate: "",
        adults: "",
        children: "",
        ...Object.fromEntries(
          Object.entries(defaultValues).map(([key, value]) => [
            key,
            value == null ? "" : String(value),
          ])
        ),
      });
    }
  }, [defaultValues, form]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      <Card
        padding={isCompact ? "md" : "lg"}
        className={cn(
          "border-slate-200/90 shadow-soft-lg",
          !isCompact && "sm:p-7",
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div
            className={cn(
              "grid gap-4",
              "sm:grid-cols-2 lg:grid-cols-4 lg:items-end",
            )}
          >
            <div className="relative sm:col-span-2 lg:col-span-3">
              <Input
                label="City Name"
                placeholder="e.g. New York"
                autoComplete="off"
                required
                error={errors.q?.message}
                className="pl-10"
                {...register("q")}
              />
              <MapPin
                className="pointer-events-none absolute left-3.5 top-[2.4rem] size-4 text-slate-400"
                aria-hidden
              />

            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              <Search className="size-4" aria-hidden />
              Search
            </Button>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <Input
              label="Check-in Date"
              type="date"
              error={errors.checkInDate?.message}
              {...register("checkInDate")}
            />

            <Input
              label="Check-out Date"
              type="date"
              error={errors.checkOutDate?.message}
              {...register("checkOutDate")}
            />
            <Input
              label="Adults"
              type="number"
              min={1}
              max={16}
              placeholder="Optional"
              error={errors.adults?.message}
              {...register("adults")}
            />

            <Input
              label="Children"
              type="number"
              min={0}
              max={16}
              placeholder="Optional"
              error={errors.children?.message}
              {...register("children")}
            />
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
