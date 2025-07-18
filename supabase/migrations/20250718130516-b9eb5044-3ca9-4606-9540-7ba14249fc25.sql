-- Insert existing pages into the pages table
INSERT INTO public.pages (title, slug, content, excerpt, meta_title, meta_description, template, published) VALUES
(
  'Home',
  'home',
  '<h1>Welcome to Radio Wave Hub</h1>
  <p>Your premier destination for music, entertainment, and community. Listen live, discover new shows, and connect with fellow music lovers.</p>
  <h2>What We Offer</h2>
  <ul>
    <li>24/7 Live Radio Streaming</li>
    <li>Exclusive Podcasts and Shows</li>
    <li>Music Charts and Reviews</li>
    <li>Community Chat and Events</li>
  </ul>',
  'Your premier destination for music, entertainment, and community. Listen live, discover new shows, and connect with fellow music lovers.',
  'Radio Wave Hub - Live Music Radio Station',
  'Listen to live radio, discover new music, and connect with the Radio Wave Hub community. 24/7 streaming, podcasts, shows, and more.',
  'default',
  true
),
(
  'Shows',
  'shows',
  '<h1>Our Radio Shows</h1>
  <p>Discover our lineup of exciting radio shows featuring talented hosts, diverse music genres, and engaging content.</p>
  <h2>Show Schedule</h2>
  <p>Check out our weekly schedule to find your favorite shows and discover new ones. From morning talk shows to late-night music sessions, we have something for everyone.</p>
  <h2>Featured Hosts</h2>
  <p>Meet our amazing team of radio hosts who bring you the best in music and entertainment throughout the week.</p>',
  'Discover our lineup of exciting radio shows featuring talented hosts, diverse music genres, and engaging content.',
  'Radio Shows - Radio Wave Hub',
  'Browse our complete schedule of radio shows. Find your favorite hosts and discover new programs on Radio Wave Hub.',
  'default',
  true
),
(
  'Podcasts',
  'podcasts',
  '<h1>Podcasts</h1>
  <p>Explore our collection of on-demand podcasts covering music, interviews, reviews, and more.</p>
  <h2>Latest Episodes</h2>
  <p>Catch up on the latest podcast episodes from your favorite hosts. Available for streaming anytime, anywhere.</p>
  <h2>Podcast Categories</h2>
  <ul>
    <li>Music Reviews and Analysis</li>
    <li>Artist Interviews</li>
    <li>Industry News and Insights</li>
    <li>Live Session Recordings</li>
  </ul>',
  'Explore our collection of on-demand podcasts covering music, interviews, reviews, and more.',
  'Podcasts - Radio Wave Hub',
  'Listen to our podcast collection featuring music reviews, artist interviews, and industry insights. Stream anytime on Radio Wave Hub.',
  'default',
  true
),
(
  'News & Blog',
  'news',
  '<h1>News & Blog</h1>
  <p>Stay up to date with the latest news from the world of music, radio, and our station.</p>
  <h2>Latest Articles</h2>
  <p>Read our latest blog posts covering music industry news, artist spotlights, event coverage, and station updates.</p>
  <h2>Categories</h2>
  <ul>
    <li>Station News</li>
    <li>Music Industry Updates</li>
    <li>Event Coverage</li>
    <li>Artist Interviews</li>
    <li>Equipment Reviews</li>
  </ul>',
  'Stay up to date with the latest news from the world of music, radio, and our station.',
  'News & Blog - Radio Wave Hub',
  'Read the latest music industry news, station updates, and artist features on the Radio Wave Hub blog.',
  'default',
  true
),
(
  'Music Charts',
  'charts',
  '<h1>Music Charts</h1>
  <p>Discover the hottest tracks and trending music with our comprehensive charts and rankings.</p>
  <h2>Current Top Tracks</h2>
  <p>See what our listeners are loving right now with our real-time music charts featuring the most popular songs on Radio Wave Hub.</p>
  <h2>Chart Categories</h2>
  <ul>
    <li>Top 40 Hits</li>
    <li>Rising Stars</li>
    <li>Genre-Specific Charts</li>
    <li>Listener Favorites</li>
  </ul>',
  'Discover the hottest tracks and trending music with our comprehensive charts and rankings.',
  'Music Charts - Radio Wave Hub',
  'Check out the latest music charts and discover trending songs on Radio Wave Hub. See what''s hot right now.',
  'default',
  true
),
(
  'Announcements',
  'announcements',
  '<h1>Station Announcements</h1>
  <p>Stay informed about important station updates, upcoming events, and special programming.</p>
  <h2>Important Updates</h2>
  <p>Get the latest information about schedule changes, special events, and new programming on Radio Wave Hub.</p>
  <h2>Upcoming Events</h2>
  <p>Don''t miss out on our special broadcasts, listener events, and community gatherings.</p>',
  'Stay informed about important station updates, upcoming events, and special programming.',
  'Announcements - Radio Wave Hub',
  'Stay updated with the latest station announcements, events, and special programming on Radio Wave Hub.',
  'default',
  true
),
(
  'About Us',
  'about',
  '<h1>About Radio Wave Hub</h1>
  <p>Radio Wave Hub is your premier destination for music, entertainment, and community connection.</p>
  <h2>Our Mission</h2>
  <p>We are dedicated to bringing you the best in music programming, connecting artists with audiences, and fostering a vibrant community of music lovers.</p>
  <h2>Our Team</h2>
  <p>Our passionate team of radio professionals, DJs, and music enthusiasts work around the clock to bring you quality programming and entertainment.</p>
  <h2>Get In Touch</h2>
  <p>We love hearing from our listeners! Contact us with feedback, requests, or just to say hello.</p>',
  'Learn more about Radio Wave Hub, our mission, and the team behind your favorite radio station.',
  'About Us - Radio Wave Hub',
  'Learn about Radio Wave Hub''s mission, team, and commitment to bringing you the best in music and entertainment.',
  'default',
  true
),
(
  'Contact',
  'contact',
  '<h1>Contact Us</h1>
  <p>Get in touch with the Radio Wave Hub team. We''d love to hear from you!</p>
  <h2>Station Information</h2>
  <p>Radio Wave Hub<br>
  Your Music, Your Community</p>
  <h2>Send Us a Message</h2>
  <p>Whether you have feedback, song requests, or just want to say hello, we''re here to listen.</p>
  <h2>Join Our Community</h2>
  <p>Follow us on social media and join our online community of music lovers.</p>',
  'Get in touch with Radio Wave Hub. Contact information and ways to connect with our team.',
  'Contact Us - Radio Wave Hub',
  'Contact Radio Wave Hub. Get in touch with our team for feedback, requests, or general inquiries.',
  'default',
  true
);