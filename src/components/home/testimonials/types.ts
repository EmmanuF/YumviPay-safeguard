
export interface TestimonialType {
  id: number;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
  text: string;
}

export interface TestimonialsProps {
  testimonials?: TestimonialType[];
}
