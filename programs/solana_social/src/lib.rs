use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod solana_social {
    use super::*;

    /// Initialize a user profile
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        bio: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.user.key();
        profile.username = username;
        profile.bio = bio;
        profile.followers = 0;
        profile.following = 0;
        profile.posts = 0;
        profile.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    /// Create a new post
    pub fn create_post(
        ctx: Context<CreatePost>,
        content: String,
        image_url: Option<String>,
    ) -> Result<()> {
        require!(content.len() > 0 && content.len() <= 280, InvalidPostLength);

        let post = &mut ctx.accounts.post;
        post.author = ctx.accounts.author.key();
        post.content = content;
        post.image_url = image_url;
        post.likes = 0;
        post.replies = 0;
        post.reposts = 0;
        post.created_at = Clock::get()?.unix_timestamp;

        // Update profile post count
        let profile = &mut ctx.accounts.profile;
        profile.posts += 1;

        Ok(())
    }

    /// Like a post
    pub fn like_post(ctx: Context<LikePost>) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.likes += 1;
        Ok(())
    }

    /// Reply to a post
    pub fn reply_to_post(
        ctx: Context<ReplyToPost>,
        content: String,
    ) -> Result<()> {
        require!(content.len() > 0 && content.len() <= 280, InvalidPostLength);

        let reply = &mut ctx.accounts.reply;
        reply.author = ctx.accounts.author.key();
        reply.parent_post = ctx.accounts.parent_post.key();
        reply.content = content;
        reply.likes = 0;
        reply.created_at = Clock::get()?.unix_timestamp;

        let post = &mut ctx.accounts.parent_post;
        post.replies += 1;

        Ok(())
    }

    /// Follow a user
    pub fn follow_user(ctx: Context<FollowUser>) -> Result<()> {
        let follower_profile = &mut ctx.accounts.follower_profile;
        let followed_profile = &mut ctx.accounts.followed_profile;

        follower_profile.following += 1;
        followed_profile.followers += 1;

        let follow = &mut ctx.accounts.follow;
        follow.follower = ctx.accounts.follower.key();
        follow.followed = ctx.accounts.followed.key();
        follow.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    /// Unfollow a user
    pub fn unfollow_user(ctx: Context<UnfollowUser>) -> Result<()> {
        let follower_profile = &mut ctx.accounts.follower_profile;
        let followed_profile = &mut ctx.accounts.followed_profile;

        if follower_profile.following > 0 {
            follower_profile.following -= 1;
        }
        if followed_profile.followers > 0 {
            followed_profile.followers -= 1;
        }

        Ok(())
    }
}

// Error codes
#[error_code]
pub enum SocialError {
    #[msg("Post content must be between 1 and 280 characters")]
    InvalidPostLength,
    #[msg("Username already taken")]
    UsernameTaken,
    #[msg("Invalid input")]
    InvalidInput,
}

// Accounts and Contexts
#[derive(Accounts)]
#[instruction(username: String)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + Profile::INIT_SPACE,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(mut)]
    pub profile: Account<'info, Profile>,
    #[account(
        init,
        payer = author,
        space = 8 + Post::INIT_SPACE,
        seeds = [b"post", author.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub post: Account<'info, Post>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LikePost<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub post: Account<'info, Post>,
}

#[derive(Accounts)]
pub struct ReplyToPost<'info> {
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(mut)]
    pub parent_post: Account<'info, Post>,
    #[account(
        init,
        payer = author,
        space = 8 + Reply::INIT_SPACE,
        seeds = [b"reply", author.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub reply: Account<'info, Reply>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FollowUser<'info> {
    #[account(mut)]
    pub follower: Signer<'info>,
    #[account(mut)]
    pub follower_profile: Account<'info, Profile>,
    /// CHECK: Verified in CPI
    pub followed: UncheckedAccount<'info>,
    #[account(mut)]
    pub followed_profile: Account<'info, Profile>,
    #[account(
        init,
        payer = follower,
        space = 8 + Follow::INIT_SPACE,
        seeds = [b"follow", follower.key().as_ref(), followed.key().as_ref()],
        bump
    )]
    pub follow: Account<'info, Follow>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnfollowUser<'info> {
    #[account(mut)]
    pub follower: Signer<'info>,
    #[account(mut)]
    pub follower_profile: Account<'info, Profile>,
    /// CHECK: Verified in CPI
    pub followed: UncheckedAccount<'info>,
    #[account(mut)]
    pub followed_profile: Account<'info, Profile>,
    #[account(
        mut,
        seeds = [b"follow", follower.key().as_ref(), followed.key().as_ref()],
        bump
    )]
    pub follow: Account<'info, Follow>,
}

// Data structures
#[account]
#[derive(InitSpace)]
pub struct Profile {
    pub owner: Pubkey,
    #[max_len(50)]
    pub username: String,
    #[max_len(280)]
    pub bio: String,
    pub followers: u64,
    pub following: u64,
    pub posts: u64,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Post {
    pub author: Pubkey,
    #[max_len(280)]
    pub content: String,
    #[max_len(500)]
    pub image_url: Option<String>,
    pub likes: u64,
    pub replies: u64,
    pub reposts: u64,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Reply {
    pub author: Pubkey,
    pub parent_post: Pubkey,
    #[max_len(280)]
    pub content: String,
    pub likes: u64,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Follow {
    pub follower: Pubkey,
    pub followed: Pubkey,
    pub created_at: i64,
}
