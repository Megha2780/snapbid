import React from 'react';
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const Terms = () => {
    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <div className="terms-section bg-light p-5 rounded-4">
                            <h2 className="text-center mb-4" style={{ color: '#ff0076', fontSize: '32px', fontFamily: '"Lexend", sans-serif' }}>Photographer Terms & Conditions:</h2>
                            <ol className="terms-list" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                                <li><strong>Image Uploads:</strong> By uploading images to SnapBid, you agree that you have the legal right to distribute and sell these images.</li>
                                <li><strong>Auctioning:</strong> You have the option to auction your images on SnapBid. By participating in auctions, you agree to abide by the rules and regulations set forth by SnapBid. </li>
                                <li><strong>Bidding:</strong> Users may participate in auctions on SnapBid by placing bids on images. By placing a bid, you agree to pay the bid amount if you are declared the winner of the auction.</li>
                                <li><strong>Payment:</strong> Upon successful sale of your image, you will receive payment based on the final bid amount, minus any applicable fees as outlined in the SnapBid fee structure.</li>
                                <li><strong>Image Rights:</strong> You retain the copyright to your images. However, by uploading them to SnapBid, you grant SnapBid a non-exclusive, worldwide, royalty-free license to use, distribute, and display your images for promotional purposes.</li>
                                <li><strong>Content Standards:</strong>  You agree not to upload any images that violate intellectual property rights, contain offensive material, or are otherwise inappropriate for the SnapBid platform.</li>
                                <li><strong>Termination:</strong> SnapBid reserves the right to terminate your account and remove your images from the platform if you violate any of these terms and conditions.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="col-md-1"></div>

                </div>
                <div className="row mt-5 mb-5">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <div className="terms-section bg-light p-5 rounded-4">
                            <h2 className="text-center mb-4" style={{ color: '#ff0076', fontSize: '32px', fontFamily: '"Lexend", sans-serif' }}>User Terms & Conditions:</h2>
                            <ol className="terms-list" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                                <li><strong>Downloading Images:</strong> Users may download images from SnapBid for personal or commercial use, depending on the licensing terms specified by the photographer.</li>
                                <li><strong>Payment:</strong> Some images on SnapBid may require payment for download. By making a purchase, you agree to pay the specified amount using the provided payment gateway.</li>
                                <li><strong>Bidding:</strong> Users may participate in auctions on SnapBid by placing bids on images. By placing a bid, you agree to pay the bid amount if you are declared the winner of the auction.</li>
                                <li><strong>Image Usage:</strong> Users are responsible for ensuring they have the necessary rights and permissions to use downloaded images in accordance with the license terms specified by the photographer.</li>
                                <li><strong>Account Security:</strong> Users are responsible for maintaining the security of their SnapBid accounts and are liable for any unauthorized use.</li>
                                <li><strong>Prohibited Activities:</strong> Users agree not to engage in any activities that violate the rights of others, including but not limited to copyright infringement and unauthorized distribution of images.</li>
                                <li><strong>Termination:</strong> SnapBid reserves the right to terminate user accounts and remove access to the platform for violations of these terms and conditions.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Terms;