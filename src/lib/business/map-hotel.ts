import type { SearchApiProperty } from "@/schemas";
import type { Hotel } from "@/types";

/**
 * Maps a SearchAPI property into the UI Hotel model.
 * Missing fields stay undefined — cards must render defensively.
 */
export function mapSearchApiPropertyToHotel(
  property: SearchApiProperty,
  index: number,
): Hotel | null {
  const name = property.name?.trim();
  if (!name) return null;

  const imageUrl =
    property.images?.[0]?.thumbnail ??
    property.images?.[0]?.original ??
    undefined;

  const addressParts = [property.city, property.country].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(", ") : undefined;

  return {
    id:
      property.property_token ??
      property.data_id ??
      `hotel-${index}-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    imageUrl,
    stars: property.extracted_hotel_class,
    hotelClass: property.hotel_class,
    rating: property.rating,
    reviewCount: property.reviews,
    priceLabel: property.price_per_night?.price,
    pricePerNight: property.price_per_night?.extracted_price,
    address,
    city: property.city,
    country: property.country,
    description: property.description,
    amenities: property.amenities,
    link: property.link,
    propertyToken: property.property_token,
  };
}

export function mapSearchApiPropertiesToHotels(
  properties: SearchApiProperty[] | undefined,
): Hotel[] {
  if (!properties?.length) return [];

  return properties
    .map((property, index) => mapSearchApiPropertyToHotel(property, index))
    .filter((hotel): hotel is Hotel => hotel !== null);
}
